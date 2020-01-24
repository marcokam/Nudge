import registry from "../../Util/registry";
import { LogLevel } from "../LoggingInterfaces";
var CategoryLogger = /** @class */ (function () {
    function CategoryLogger(defaultSettings, wrappedLogger) {
        var _this = this;
        this.configure = function (settings) {
            _this.categorySettings = settings;
        };
        this.logEvent = function (event) {
            if (event.level > _this.categorySettings.minLevel) {
                return;
            }
            _this.logEventInternal(event);
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
        this.logWithLevel = function (level, args) {
            if (level > _this.categorySettings.minLevel) {
                return;
            }
            _this.logEventInternal({ level: level, args: function () { return args; } });
        };
        this.categorySettings = defaultSettings;
        this.wrappedLogger = wrappedLogger || (function () { return registry.logger; });
    }
    CategoryLogger.prototype.logEventInternal = function (event) {
        this.wrappedLogger().logEvent(event);
    };
    return CategoryLogger;
}());
export default CategoryLogger;
//# sourceMappingURL=CategoryLogger.js.map