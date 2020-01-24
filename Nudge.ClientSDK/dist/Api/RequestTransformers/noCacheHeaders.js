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
var fixedHeaders = {
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "Expires": "0",
};
var noCacheHeaders = function () { return function (request, next) {
    var nextRequest = __assign(__assign({}, request), { headers: __assign(__assign({}, request.headers), fixedHeaders) });
    return next(nextRequest);
}; };
export default noCacheHeaders;
//# sourceMappingURL=noCacheHeaders.js.map