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
//TODO: Combine with noCacheHeaders.ts into simple "withHeaders" function
var fixedHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json",
};
var jsonHeaders = function () { return function (request, next) {
    var nextRequest = __assign(__assign({}, request), { headers: __assign(__assign({}, request.headers), fixedHeaders) });
    return next(nextRequest);
}; };
export default jsonHeaders;
//# sourceMappingURL=jsonHeaders.js.map