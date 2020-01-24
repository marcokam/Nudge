import * as AreEquals from "../Comparison/AreEquals";
// Memoizes only a single value at once.
// If input changes, old value is discarded.
var SingleValueMemoizer = /** @class */ (function () {
    function SingleValueMemoizer(producer, inputsAreEqual) {
        var _this = this;
        this.computeValue = function (input) {
            if (_this.output === undefined || _this.input === undefined || !_this.inputsAreEqual(input, _this.input)) {
                var result = _this.producer(input);
                _this.input = input;
                _this.output = result;
                return result;
            }
            return _this.output;
        };
        this.producer = producer;
        this.inputsAreEqual = inputsAreEqual || AreEquals.strictEquals;
    }
    return SingleValueMemoizer;
}());
export { SingleValueMemoizer };
//# sourceMappingURL=Memoizer.js.map