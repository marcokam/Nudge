export var URI = "Pred";
var Pred = /** @class */ (function () {
    function Pred(a) {
        var _this = this;
        this.tag = "Pred";
        this.run = function (a) { return _this.value(a); };
        this.contramap = function (f) { return new Pred(function (b) { return _this.run(f(b)); }); };
        this.concat = function (predA) { return new Pred(function (a) { return _this.run(a) && predA.run(a); }); };
        this.concatOr = function (predA) { return new Pred(function (a) { return _this.run(a) || predA.run(a); }); };
        this.value = a;
    }
    Pred.of = function (a) { return new Pred(a); };
    Pred.empty = function () { return new Pred(function () { return true; }); };
    Pred.not = function (p) { return new Pred(function (a) { return !p.run(a); }); };
    return Pred;
}());
export { Pred };
export var contramap = function (f) { return function (predA) { return predA.contramap(f); }; };
export var concat = function (predA1) { return function (predA2) { return predA1.concat(predA2); }; };
export var empty = function () { return Pred.empty(); };
export var pred = {
    contramap: contramap,
    empty: empty,
    concat: concat,
};
//# sourceMappingURL=Pred.js.map