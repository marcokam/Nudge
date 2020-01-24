import { filter, map, reduce, first, flatMap, uniqBy, reverse, range, min, max, any } from "./IterableUtils";
// The generator functions in IterableUtils are not re-runnable.  
// Wrap them in this to make them called every time the consumer asks
// for an Iterator.
function produce(fn) {
    var _a;
    return _a = {},
        _a[Symbol.iterator] = function () { return fn()[Symbol.iterator](); },
        _a;
}
var NudgeIterable = /** @class */ (function () {
    function NudgeIterable(wrapped) {
        var _this = this;
        this[Symbol.iterator] = function () { return _this.wrapped[Symbol.iterator](); };
        this.filter = function (predicate) { return new NudgeIterable(produce(function () { return filter(_this.wrapped, predicate); })); };
        this.map = function (mapper) { return new NudgeIterable(produce(function () { return map(_this.wrapped, mapper); })); };
        this.reduce = function (aggregator, start) {
            return reduce(_this.wrapped, aggregator, start);
        };
        this.first = function () {
            return first(_this.wrapped);
        };
        this.flatMap = function (mapper) { return new NudgeIterable(produce(function () { return flatMap(_this.wrapped, mapper); })); };
        this.uniqBy = function (keyFn) { return new NudgeIterable(produce(function () { return uniqBy(_this.wrapped, keyFn); })); };
        this.reverse = function () { return new NudgeIterable(produce(function () { return reverse(_this.wrapped); })); };
        this.toArray = function () {
            return Array.from(_this.wrapped);
        };
        this.min = function (comparer) {
            return min(_this.wrapped, comparer);
        };
        this.max = function (comparer) {
            return max(_this.wrapped, comparer);
        };
        this.any = function (predicate) { return (any(_this.wrapped, predicate)); };
        this.wrapped = wrapped;
    }
    NudgeIterable.fromIterable = function (items) { return new NudgeIterable(items); };
    NudgeIterable.fromArray = function (items) { return new NudgeIterable(items); };
    NudgeIterable.fromItems = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return new NudgeIterable(items);
    };
    NudgeIterable.fromEmpty = function () { return new NudgeIterable([]); };
    NudgeIterable.fromRange = function (start, end, step) {
        if (step === void 0) { step = 1; }
        return new NudgeIterable(range(start, end, step));
    };
    return NudgeIterable;
}());
export default NudgeIterable;
//# sourceMappingURL=NudgeIterable.js.map