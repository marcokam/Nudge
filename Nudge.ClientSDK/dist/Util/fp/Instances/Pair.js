export var URI = "Pair";
var Pair = /** @class */ (function () {
    function Pair(a, b) {
        var _this = this;
        this.tag = "Pair";
        this.fst = function () { return _this.value[0]; };
        this.snd = function () { return _this.value[1]; };
        this.toArray = function () { return _this.value; };
        this.merge = function (f) { return f(_this.fst(), _this.snd()); };
        this.map = function (f) { return new Pair(_this.fst(), f(_this.snd())); };
        this.bimap = function (f, g) { return new Pair(f(_this.fst()), g(_this.snd())); };
        this.value = [a, b];
    }
    Pair.of = function (a, b) { return new Pair(a, b); };
    return Pair;
}());
export { Pair };
export var map = function (f) { return function (pairAB) { return pairAB.map(f); }; };
export var bimap = function (f, g) { return function (pairAB) { return pairAB.bimap(f, g); }; };
export var pair = {
    map: map,
    bimap: bimap,
};
//# sourceMappingURL=Pair.js.map