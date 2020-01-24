var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { LogLevel } from "../LoggingInterfaces";
import { voidPromise } from "../../Util/PromiseUtils";
var ConsoleAppender = /** @class */ (function () {
    /* eslint no-console: 0 */
    function ConsoleAppender(consoleLike) {
        var _this = this;
        if (consoleLike === void 0) { consoleLike = console; }
        this.append = function (event) {
            var args = event.args();
            var func = _this.getFunc(event.level);
            if (!func) {
                throw Error("Unknown event level");
            }
            func.apply(void 0, __spread(args));
            return voidPromise;
        };
        this.getFunc = function (logLevel) {
            switch (logLevel) {
                case LogLevel.error: return _this.consoleLike.error;
                case LogLevel.warning: return _this.consoleLike.warn;
                case LogLevel.info: return _this.consoleLike.log;
                case LogLevel.debug: return _this.consoleLike.debug;
                default: return null;
            }
        };
        // Bind this onto console object
        this.consoleLike = {
            error: consoleLike.error.bind(consoleLike),
            warn: consoleLike.warn.bind(consoleLike),
            log: consoleLike.log.bind(consoleLike),
            debug: consoleLike.debug.bind(consoleLike),
        };
    }
    return ConsoleAppender;
}());
export default ConsoleAppender;
//# sourceMappingURL=ConsoleAppender.js.map