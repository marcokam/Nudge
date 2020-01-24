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
import { Task } from "../../Util/fp/Instances/Task";
import { toResult } from "../../Util/fp/Instances/Producer";
var withHeader = function (headerName, headerValueProducer) { return function (request, next) {
    var headerValueResult = toResult(headerValueProducer);
    return Task.toPromise(headerValueResult)
        .then(function (value) {
        var _a;
        var nextRequest = __assign(__assign({}, request), { headers: __assign(__assign({}, request.headers), (_a = {}, _a[headerName] = value, _a)) });
        return next(nextRequest);
    });
}; };
export default withHeader;
//# sourceMappingURL=withHeader.js.map