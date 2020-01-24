var LazyValue = /** @class */ (function () {
    function LazyValue(producer) {
        var _this = this;
        this.produced = false;
        this.getValue = function () {
            if (_this.produced) {
                return _this.value;
            }
            _this.value = _this.producer();
            _this.produced = true;
            return _this.value;
        };
        this.producer = producer;
    }
    LazyValue.of = function (a) { return new LazyValue(a).getValue; };
    return LazyValue;
}());
export default LazyValue;
//# sourceMappingURL=LazyValue.js.map