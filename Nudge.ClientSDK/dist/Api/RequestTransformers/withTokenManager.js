var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
//TODO: Add auto-refresh + retry
var withTokenManager = function (tokenManager) { return function (request, next) {
    if (request.accessToken) {
        return next(request);
    }
    var accessToken = tokenManager.getAccessToken();
    if (!accessToken) {
        return next(request);
    }
    var nextRequest = __assign({ accessToken: accessToken }, request);
    return next(nextRequest);
}; };
export default withTokenManager;
//# sourceMappingURL=withTokenManager.js.map