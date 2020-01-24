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
var withStatusCodeOverride = function () { return function (request, next) {
    if (!request.statusCodeOverride) {
        return next(request);
    }
    var nextRequest = __assign(__assign({}, request), { headers: __assign(__assign({}, request.headers), { "X-HTTP-Status-Code-Override": 200 }) });
    return next(nextRequest)
        .then(function (response) {
        var originalStatusCodeString = response.headers.get("X-Original-Http-Status-Code");
        if (!originalStatusCodeString) {
            return response;
        }
        var originalStatusCode = parseInt(originalStatusCodeString, 10);
        if (!originalStatusCode) {
            return response;
        }
        return __assign(__assign({}, response), { status: originalStatusCode });
    });
}; };
export default withStatusCodeOverride;
//# sourceMappingURL=withStatusCodeOverride.js.map