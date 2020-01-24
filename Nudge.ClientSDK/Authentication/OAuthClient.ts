import { Task, Result } from "~/Util/fp/Instances/Task";
import registry from "~/Util/registry";

export enum GrantType {
    AuthorizationCode = "authorization_code",
    RefreshToken = "refresh_token"
}

const grantTypeKeys = {
    [GrantType.AuthorizationCode]: "code",
    [GrantType.RefreshToken]: "refresh_token"
};

export interface OAuthClientConfig {
    tokenPostUrl: string;
    clientId: string;
    clientSecret: string;
}
export enum TokenPostErrorCode {
    InvalidGrant = "invalid_grant"
}

function tokenPostError(reason: string, err?: TokenPostErrorCode): TokenPostError {
    registry.logger.error("login failed", { reason }, err);
    return { isSuccess: false };
}

interface TokenPostError {
    isSuccess: false;
    error?: TokenPostErrorCode;
}
interface TokenPostResponse {
    isSuccess: true;
    access_token: string;
    refresh_token: string;
    userName: string;
    expires_in: number;
    refresh_token_expires_in: number;
}
export function isTokenPostError(responseOrError: TokenPostError | TokenPostResponse): responseOrError is TokenPostError {
    return !responseOrError.isSuccess;
}

export default class OAuthClient {

    private readonly clientConfig: Result<OAuthClientConfig>;

    constructor (clientConfig: Result<OAuthClientConfig>) {
        this.clientConfig = clientConfig;
    }

    tokenPost = (grantType: GrantType, grantValue: string): Promise<TokenPostResponse | TokenPostError> => Task.toPromise(this.clientConfig)
        .then(config => {
            const { clientId, clientSecret, tokenPostUrl } = config;
            const grantKey = grantTypeKeys[grantType];
    
            const tokenPostBody = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}&${grantKey}=${grantValue}`;
            return fetch(tokenPostUrl, { 
                method: "POST",                   
                body: tokenPostBody,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            });                
        })
        .then(response => {
            if (!response.ok) {
                // Consuming code may want to know when specific errors happen.  eg "invalid_grant"
                if (response.status === 400) {                    
                    return response.json().then(b => ({ isSuccess: false, error: b.error as TokenPostErrorCode }));
                }
                return tokenPostError(`token-post request failed with status code ${status}`);
            }
            
            // Success.  Just add the "isSuccess" property to it
            return response.json().then(tpr => ({ isSuccess: true, ...(tpr as TokenPostResponse) }));
        });

    useAuthorizationCode = (responseUrl: URL): Promise<TokenPostResponse | TokenPostError> => {
        const qsParams = responseUrl.searchParams;

        // Check for an error on the query string
        const error = qsParams.get("error");
        if (error) {
            return Promise.resolve(tokenPostError(error));
        }
        
        // Pull the authorization code off the query string
        const authorizationCode = qsParams.get("code");
        if (!authorizationCode) {
            return Promise.resolve(tokenPostError("missing code"));
        }
    
        // Call token-post endpoint to trade code for refresh and access tokens
        return this.tokenPost(GrantType.AuthorizationCode, authorizationCode)
            .then(tpr => {
                if (isTokenPostError(tpr)) {
                    return tpr;
                }
            
                // Get the refresh_token and access_token off the response
                const refreshToken = tpr.refresh_token;
                const accessToken = tpr.access_token;
                if (!refreshToken) {
                    return tokenPostError("refresh_token missing");
                }
                if (!accessToken) {
                    return tokenPostError("access_token missing");
                }
            
                return tpr;
            })

    }

}
