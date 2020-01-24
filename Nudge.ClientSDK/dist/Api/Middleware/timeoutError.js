import { RaceTimeout } from "../../Util/PromiseUtils";
import TimeoutError from "../Errors/TimeoutError";
var timeoutError = function (defaultTimeoutMs) { return function (request, next) {
    var timeoutMs = request.timeout || defaultTimeoutMs;
    return RaceTimeout(next(request), timeoutMs)
        .then(function (result) {
        if (result == null) {
            throw new TimeoutError(timeoutMs, request.url);
        }
        return result;
    });
}; };
export default timeoutError;
//# sourceMappingURL=timeoutError.js.map