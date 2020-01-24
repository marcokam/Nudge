import { LogLevel } from "./LoggingInterfaces";
var BufferedLogger = /** @class */ (function () {
    function BufferedLogger() {
        var _this = this;
        this.queue = [];
        this.wrapped = null;
        this.logEvent = function (event) {
            if (_this.wrapped) {
                _this.sendDirect(_this.wrapped, event);
            }
            else {
                _this.queue.push(event);
            }
        };
        this.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.enqueueWithLevel(LogLevel.error, args);
        };
        this.warning = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.enqueueWithLevel(LogLevel.warning, args);
        };
        this.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.enqueueWithLevel(LogLevel.info, args);
        };
        this.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.enqueueWithLevel(LogLevel.debug, args);
        };
        this.enqueueWithLevel = function (level, args) {
            _this.logEvent({ level: level, args: function () { return args; } });
        };
        this.sendDirect = function (wrapped, event) {
            wrapped.logEvent(event);
        };
    }
    BufferedLogger.prototype.setLogger = function (wrapped) {
        if (this.wrapped) {
            throw new Error("Attempt to setLogger when logger already set.");
        }
        this.wrapped = wrapped;
        // Flush queue
        var current = undefined;
        while (current = this.queue.shift()) {
            this.sendDirect(this.wrapped, current);
        }
    };
    return BufferedLogger;
}());
export default BufferedLogger;
//# sourceMappingURL=BufferedLogger.js.map