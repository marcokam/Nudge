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
import { createTimeoutAbortSignal, joinAbortSignals } from "../../Util/PromiseUtils";
var timeoutAbortSignal = function (defaultTimeoutMs) { return function (request, next) {
    var timeoutMs = request.timeout || defaultTimeoutMs;
    var timeoutSignal = createTimeoutAbortSignal(timeoutMs);
    var finalSignal = request.signal
        ? joinAbortSignals(timeoutSignal, request.signal)
        : timeoutSignal;
    return next(__assign(__assign({}, request), { signal: finalSignal }));
}; };
export default timeoutAbortSignal;
//# sourceMappingURL=timeoutAbortSignal.js.map