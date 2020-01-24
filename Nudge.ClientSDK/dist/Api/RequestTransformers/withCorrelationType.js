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
var headerName = "x-correlation-type";
var withCorrelationType = function (type) { return function (request, next) {
    var _a;
    var nextRequest = __assign(__assign({}, request), { headers: __assign(__assign({}, request.headers), (_a = {}, _a[headerName] = type, _a)) });
    return next(nextRequest);
}; };
export default withCorrelationType;
//# sourceMappingURL=withCorrelationType.js.map