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
//TODO: When we add auto-refresh + retry, this should not accept the token manager
var withBearerToken = function () { return function (request, next) {
    if (!request.accessToken) {
        return next(request);
    }
    var nextRequest = __assign(__assign({}, request), { headers: __assign(__assign({}, request.headers), { "Authorization": "Bearer " + request.accessToken }) });
    return next(nextRequest);
}; };
export default withBearerToken;
//# sourceMappingURL=withBearerToken.js.map