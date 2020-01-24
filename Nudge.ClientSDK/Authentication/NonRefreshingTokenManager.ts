import TokenManager, { TokenRefreshResponse } from "./TokenManager";

export default class NonRefreshingTokenManager implements TokenManager {
    
    constructor(accessTokenFunc: () => string | null) {
        this.getAccessToken = accessTokenFunc;
    }
    readonly getAccessToken: () => string | null;
    supportsRefresh = false;
    refreshAccessToken = (): Promise<TokenRefreshResponse> => { throw new Error("This TokenManager does not support refresh.") };
}