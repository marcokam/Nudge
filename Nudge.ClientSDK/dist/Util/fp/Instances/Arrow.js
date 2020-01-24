var URI = "Arrow";
var Arrow = /** @class */ (function () {
    function Arrow(f) {
        var _this = this;
        this.tag = "Arrow";
        this.run = function (a) { return _this.value(a); };
        this.map = function (f) { return new Arrow(function (a) { return f(_this.run(a)); }); };
        this.contramap = function (f) { return new Arrow(function (c) { return _this.run(f(c)); }); };
        this.value = f;
    }
    Arrow.of = function (f) { return new Arrow(f); };
    return Arrow;
}());
export { Arrow };
export var map = function (f) { return function (arrowAB) { return arrowAB.map(f); }; };
export var contramap = function (f) { return function (arrowAB) { return arrowAB.contramap(f); }; };
export var of = function (f) { return new Arrow(f); };
export var arrow = {
    map: map,
    contramap: contramap,
};
//# sourceMappingURL=Arrow.js.map