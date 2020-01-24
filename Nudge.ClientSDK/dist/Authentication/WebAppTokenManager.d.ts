import TokenManager, { TokenRefreshResponse } from "./TokenManager";
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
export default class WebAppTokenManager implements TokenManager {
    private readonly settings;
    private refreshTimeoutFunc?;
    private currentAccessToken;
    constructor(settings: Partial<WebAppTokenManagerSettings>);
    supportsRefresh: boolean;
    getAccessToken: () => string | null;
    refreshAccessToken: () => Promise<TokenRefreshResponse>;
    private createRefreshTimeout;
    private performRefreshAndCatch;
    private performRefresh;
}
