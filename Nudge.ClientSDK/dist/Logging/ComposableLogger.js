import { LogLevel } from "./LoggingInterfaces";
import LazyValue from "../Util/LazyValue";
var ComposableLogger = /** @class */ (function () {
    function ComposableLogger(appender, argumentResolver) {
        var _this = this;
        this.logEvent = function (event) {
            try {
                _this.logUnsafe(event).catch(_this.logErrorWhileLogging);
            }
            catch (err) {
                _this.logErrorWhileLogging(err);
            }
        };
        this.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.logWithLevel(LogLevel.error, args);
        };
        this.warning = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.logWithLevel(LogLevel.warning, args);
        };
        this.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.logWithLevel(LogLevel.info, args);
        };
        this.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.logWithLevel(LogLevel.debug, args);
        };
        this.logWithLevel = function (level, args) { return _this.logEvent({ level: level, args: function () { return args; } }); };
        this.logUnsafe = function (event) {
            return _this.appender.append({
                level: event.level,
                args: new LazyValue(function () { return _this.argumentResolver.resolve(event.args()); }).getValue
            });
        };
        this.logErrorWhileLogging = function (err) {
            try {
                // Since we are calling to external code in order to resolve
                // the true values (ie the message argument), exceptions
                // above may not actually be problems with the logger.
                // Attempt to log this new exception
                _this.logUnsafe({ level: LogLevel.error, args: function () { return ["Error while logging", err]; } }).catch(function () { });
            }
            catch (ignored) {
                // noop
            }
        };
        this.appender = appender;
        this.argumentResolver = argumentResolver;
    }
    return ComposableLogger;
}());
export default ComposableLogger;
//# sourceMappingURL=ComposableLogger.js.map