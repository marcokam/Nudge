var LazyMap = /** @class */ (function () {
    function LazyMap(producer) {
        var _this = this;
        this.values = new Map();
        this.getValue = function (key) {
            var fromMap = _this.values.get(key);
            if (typeof (fromMap) !== "undefined") {
                return fromMap;
            }
            var newValue = _this.producer(key);
            _this.values.set(key, newValue);
            return newValue;
        };
        this.producer = producer;
    }
    return LazyMap;
}());
export default LazyMap;
//# sourceMappingURL=LazyMap.js.map