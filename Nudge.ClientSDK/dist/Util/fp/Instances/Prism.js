export var URI = "Prism";
var Prism = /** @class */ (function () {
    function Prism(tryGet, inject) {
        var _this = this;
        this.tag = "Prism";
        this.then = function (tryGet, inject) { return new Prism(function (a) { return _this.tryGet(a).chain(tryGet); }, function (c, a) { return _this.tryGet(a)
            .map(function (b) { return _this.inject(inject(c, b), a); })
            .getOrElse(function () { return c; }); }); };
        this.tryGet = tryGet;
        this.inject = inject;
    }
    Prism.of = function (tryGet, inject) { return new Prism(tryGet, inject); };
    return Prism;
}());
export { Prism };
//# sourceMappingURL=Prism.js.map