import TokenManager, { TokenRefreshResponse } from "./TokenManager";
export default class NonRefreshingTokenManager implements TokenManager {
    constructor(accessTokenFunc: () => string | null);
    readonly getAccessToken: () => string | null;
    supportsRefresh: boolean;
    refreshAccessToken: () => Promise<TokenRefreshResponse>;
}
