var NonRefreshingTokenManager = /** @class */ (function () {
    function NonRefreshingTokenManager(accessTokenFunc) {
        this.supportsRefresh = false;
        this.refreshAccessToken = function () { throw new Error("This TokenManager does not support refresh."); };
        this.getAccessToken = accessTokenFunc;
    }
    return NonRefreshingTokenManager;
}());
export default NonRefreshingTokenManager;
//# sourceMappingURL=NonRefreshingTokenManager.js.map