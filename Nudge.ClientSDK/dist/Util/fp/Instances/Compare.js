export var URI = "Compare";
var Compare = /** @class */ (function () {
    function Compare(a) {
        var _this = this;
        this.tag = "Compare";
        this.run = function (a, b) { return _this.value(a, b); };
        this.contramap = function (f) { return new Compare(function (a, b) { return _this.run(f(a), f(b)); }); };
        this.concat = function (compareA) { return new Compare(function (a, b) { return _this.run(a, b) || compareA.run(a, b); }); };
        this.value = a;
    }
    Compare.of = function (a) { return new Compare(a); };
    Compare.empty = function () { return new Compare(function () { return 0; }); };
    return Compare;
}());
export { Compare };
export var contramap = function (f) { return function (compareA) { return compareA.contramap(f); }; };
export var concat = function (compareA1) { return function (compareA2) { return compareA1.concat(compareA2); }; };
export var empty = function () { return Compare.empty(); };
export var pred = {
    contramap: contramap,
    empty: empty,
    concat: concat,
};
//# sourceMappingURL=Compare.js.map