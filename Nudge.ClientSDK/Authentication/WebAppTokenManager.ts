import TokenManager, { TokenRefreshResponse } from "./TokenManager";
import {  invariantTruthy } from "~/Util/utils";
import { reusableSingleton, promiseTry, createTimeoutAbortSignal } from "~/Util/PromiseUtils";
import HttpError from "~/Api/Errors/HttpError";
import registry from "~/Util/registry";

export interface WebAppTokenManagerSettings {
    readonly startingAccessToken: string;
    readonly refreshUrl: string;
    readonly initialExpirySeconds?: number;
    readonly isImpersonating: boolean;
    readonly userName: string;
    readonly expirationThresholdSeconds: number;
    readonly onAccessTokenChange: (newAccessToken: string | null) => void;
    readonly onRefreshFail: () => void;
    readonly additionalHeaders: any;
}
const defaultSettings = {
    startingAccessToken: null,
    isImpersonating: false,
    expirationThresholdSeconds: 280,
    userName: "",    
    onAccessTokenChange: () => {},
    onRefreshFail: () => {}
}
export default class WebAppTokenManager implements TokenManager {
    
    private readonly settings: WebAppTokenManagerSettings;
    private refreshTimeoutFunc?: NodeJS.Timeout;
    private currentAccessToken: string | null;

    constructor(settings: Partial<WebAppTokenManagerSettings>) {
        const finalSettings = Object.assign({}, defaultSettings, settings);
        invariantTruthy(finalSettings.refreshUrl, "missing refreshUrl");

        this.settings = finalSettings as WebAppTokenManagerSettings;
        if (this.settings.initialExpirySeconds) {
            this.refreshTimeoutFunc = this.createRefreshTimeout(this.settings.initialExpirySeconds);
        }
        this.currentAccessToken = this.settings.startingAccessToken;
    }

    supportsRefresh = true;

    getAccessToken = () => this.currentAccessToken;

    refreshAccessToken = (): Promise<TokenRefreshResponse> => {
        return this.performRefresh();
    }

    private createRefreshTimeout = (accessTokenExpiresInSeconds: number): NodeJS.Timeout => {
        // Refresh the access token when it is close to expiring
        var intervalSeconds = Math.max(accessTokenExpiresInSeconds - this.settings.expirationThresholdSeconds, 0);        
        return setTimeout(this.performRefreshAndCatch, intervalSeconds * 1000);
    }

    private performRefreshAndCatch = () => this.performRefresh().catch(() => {});
    private performRefresh = reusableSingleton(() => promiseTry(() => { 
    
        registry.logger.info("Refreshing tokens.");
        const body = this.settings.isImpersonating ? { "impersonateUser" : this.settings.userName } : { };
        const signal = createTimeoutAbortSignal(10000); // 10 seconds
        const options: RequestInit = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Accept": "application/json",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                "Expires": "0",
                ...this.settings.additionalHeaders
            },
            credentials: "same-origin",
            signal
        };
        return fetch(this.settings.refreshUrl, options);
    })
        .then(response => {
            if (response.ok) {
                return response;        
            }
            
            // Refresh token is invalid.  Log the user out.
            //TODO: Consider waiting until the last minute - when the access token is invalid AND refresh fails.
            if (response.status === 403) {
                this.settings.onRefreshFail();
            }
            
            throw new HttpError(response);
        })
        .then(response => response.json())
        .then(responseObj => {
            const accessToken = responseObj.accessToken;
            const accessTokenExpiresInSeconds = responseObj.accessTokenExpiresInSeconds;
            if (!accessToken) {
                throw Error("Missing access token from refresh API response.");
            }
            if (!accessTokenExpiresInSeconds) {
                throw Error("Missing accessTokenExpiresInSeconds from refresh API response.");
            }
    
            this.currentAccessToken = accessToken;
            this.settings.onAccessTokenChange(accessToken);
            if (this.refreshTimeoutFunc) clearTimeout(this.refreshTimeoutFunc);
            this.refreshTimeoutFunc = this.createRefreshTimeout(accessTokenExpiresInSeconds);
            const response: TokenRefreshResponse = {
                success: true,
                accessToken: accessToken
            };
            return response;
        })
        .catch(err => {
            registry.logger.error("Error refreshing tokens.", err);
            if (this.refreshTimeoutFunc) clearTimeout(this.refreshTimeoutFunc);
            const response: TokenRefreshResponse = {
                success: false,
                accessToken: null
            };
            return response;
        }));    

}
