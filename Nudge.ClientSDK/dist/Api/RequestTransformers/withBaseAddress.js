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
//NOTE: This requires a polyfil for URL for IE if a client wants to use this and support IE. (eg Outlook)
var withBaseAddress = function (baseAddress) { return function (request, next) {
    var fullUrl = (new URL(request.url, baseAddress)).toString();
    var finalRequest = (fullUrl === request.url)
        ? request
        : __assign(__assign({}, request), { url: fullUrl });
    return next(finalRequest);
}; };
export default withBaseAddress;
//# sourceMappingURL=withBaseAddress.js.map