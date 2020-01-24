import LazyMap from "../../Util/LazyMap";
var CustomCategorySettingsProvider = /** @class */ (function () {
    function CustomCategorySettingsProvider(defaultSettings, explicit) {
        var _this = this;
        this.get = function (category) { return _this.values.getValue(category); };
        this.getInternal = function (key) {
            var explicit = _this.explicit.get(key);
            if (explicit) {
                return explicit;
            }
            return _this.defaultSettings;
        };
        // Build explicit map
        this.explicit = new Map();
        if (explicit) {
            explicit.forEach(function (c) {
                _this.explicit.set(c.key, c.value);
            });
        }
        this.defaultSettings = defaultSettings;
        this.values = new LazyMap(this.getInternal);
    }
    return CustomCategorySettingsProvider;
}());
export default CustomCategorySettingsProvider;
//# sourceMappingURL=CustomCategorySettingsProvider.js.map