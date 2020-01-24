var Subscribable = /** @class */ (function () {
    function Subscribable(currentValue) {
        var _this = this;
        this.subscribers = [];
        this.subscribe = function (subscribeFn) {
            _this.subscribers.push(subscribeFn);
        };
        this.getValue = function () { return _this.currentValue; };
        this.setValue = function (newValue) {
            var oldValue = _this.currentValue;
            _this.currentValue = newValue;
            if (oldValue !== newValue) {
                _this.subscribers.forEach(function (subscriber) { return subscriber(newValue); });
            }
        };
        this.currentValue = currentValue;
    }
    return Subscribable;
}());
export default Subscribable;
//# sourceMappingURL=Subscribable.js.map