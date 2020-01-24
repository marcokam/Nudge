import { isNotNull } from "../function";
export var URI = "Option";
var None = /** @class */ (function () {
    function None() {
        var _this = this;
        this.tag = "None";
        this.map = function (f) { return _this; }; // eslint-disable-line @typescript-eslint/no-unused-vars
        this.ap = function (Ob) { return _this; }; // eslint-disable-line @typescript-eslint/no-unused-vars
        this.chain = function (f) { return _this; }; // eslint-disable-line @typescript-eslint/no-unused-vars
        this.traverse1 = function (F, f) {
            return F.of(_this);
        };
        this.traverse2 = function (F, f) {
            return F.of(_this);
        };
        this.getOrElse = function (f) { return f(); };
    }
    return None;
}());
export { None };
export var none = new None();
var Some = /** @class */ (function () {
    function Some(value) {
        var _this = this;
        this.tag = "Some";
        this.map = function (f) { return isNotNull(f(_this.value)) ? new Some(f(_this.value)) : none; };
        this.ap = function (Ob) { return Ob.map(_this.value); };
        this.chain = function (f) { return f(_this.value); };
        this.traverse1 = function (F, f) {
            return F.ap(F.of(function (b) { return new Some(b); }))(f(_this.value));
        };
        this.traverse2 = function (F, f) {
            return F.ap(F.of(function (b) { return new Some(b); }))(f(_this.value));
        };
        this.getOrElse = function (f) { return _this.value; }; // eslint-disable-line @typescript-eslint/no-unused-vars
        this.value = value;
    }
    return Some;
}());
export { Some };
export var some = function (a) { return new Some(a); };
export var map = function (f) { return function (Oa) { return Oa.map(f); }; };
export var ap = function (Oab) { return function (Oa) { return Oab.ap(Oa); }; };
export var chain = function (f) { return function (Oa) { return Oa.chain(f); }; };
export var of = function (a) { return isNotNull(a) ? some(a) : none; };
export var option = {
    map: map,
    ap: ap,
    chain: chain,
    of: of,
};
export var tryCatch = function (f) {
    try {
        return option.of(f());
    }
    catch (err) {
        return none;
    }
};
//# sourceMappingURL=Option.js.map