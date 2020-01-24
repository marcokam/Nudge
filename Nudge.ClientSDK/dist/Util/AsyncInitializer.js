var AsyncInitializer = /** @class */ (function () {
    function AsyncInitializer(initializer) {
        var _this = this;
        this.promise = null;
        this.initialize = function () {
            if (!_this.promise) {
                _this.promise = _this.initializer();
            }
            return _this.promise;
        };
        this.initializer = initializer;
    }
    return AsyncInitializer;
}());
export default AsyncInitializer;
//# sourceMappingURL=AsyncInitializer.js.map