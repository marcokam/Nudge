import { isFunction } from "../../Util/utils";
import registry from "../../Util/registry";
import LazyMap from "../../Util/LazyMap";
import CategoryLogger from "./CategoryLogger";
import { forEach } from "../../Util/IterableUtils";
var DefaultCategoryLoggerFactory = /** @class */ (function () {
    function DefaultCategoryLoggerFactory(categorySettingsProvider, loggerProducer) {
        var _this = this;
        this.configure = function (settings) {
            _this.categorySettingsProvider = settings;
            // Reconfigure existing loggers
            forEach(_this.loggers.values.entries(), function (entry) {
                return entry[1].configure(settings.get(entry[0]));
            });
        };
        this.create = function (category) { return _this.loggers.getValue(category); };
        this.createLoggerInternal = function (category) {
            return new CategoryLogger(_this.categorySettingsProvider.get(category), _this.loggerProducer);
        };
        this.categorySettingsProvider = categorySettingsProvider;
        // Setup Logger producer
        this.loggerProducer = loggerProducer
            ? isFunction(loggerProducer)
                ? loggerProducer
                : function () { return loggerProducer; }
            : function () { return registry.logger; };
        // Set loggers map
        this.loggers = new LazyMap(this.createLoggerInternal);
    }
    return DefaultCategoryLoggerFactory;
}());
export default DefaultCategoryLoggerFactory;
//# sourceMappingURL=CategoryLoggerFactory.js.map