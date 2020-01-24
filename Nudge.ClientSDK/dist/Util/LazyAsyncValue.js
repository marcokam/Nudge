var LazyAsyncValue = /** @class */ (function () {
    function LazyAsyncValue(producer) {
        var _this = this;
        this.produced = false;
        this.getValue = function () {
            if (_this.produced) {
                return _this.value; // Cast to remove undefined 
            }
            _this.value = _this.producer();
            _this.produced = true;
            return _this.value;
        };
        this.producer = producer;
    }
    LazyAsyncValue.of = function (a) { return new LazyAsyncValue(a).getValue; };
    return LazyAsyncValue;
}());
export default LazyAsyncValue;
//# sourceMappingURL=LazyAsyncValue.js.map