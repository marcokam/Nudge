var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { uniq, uniqBy, isEmpty, optHead, optFind, flatten, groupBy } from "../array";
import { option } from "./Option";
export var URI = "List";
var List = /** @class */ (function () {
    function List(a) {
        var _this = this;
        this.tag = "List";
        this.map = function (f) { return new List(_this.value.map(f)); };
        this.ap = function (ListB) {
            return new List(flatten(ListB.value
                .map(function (b) { return _this.value
                .map(function (f) { return f(b); }); })));
        };
        this.chain = function (f) {
            return new List(flatten(_this.value.map(function (a) { return f(a).value; })));
        };
        this.filter = function (p) {
            return new List(_this.value.filter(p));
        };
        this.concat = function (listA) { return new List(_this.value.concat(listA.value)); };
        this.fold = function (f, seed) { return _this.value.reduce(f, seed); };
        this.traverse1 = function (F, f) {
            return _this.value.reduce(function (acc, a) { return F.ap(F.map(function (listB) { return function (b) { return listB.concat(List.of(b)); }; })(acc))(f(a)); }, F.of(List.empty()));
        };
        this.traverse2 = function (F, f) {
            return _this.value.reduce(function (acc, a) { return F.ap(F.map(function (listB) { return function (b) { return listB.concat(List.of(b)); }; })(acc))(f(a)); }, F.of(List.empty()));
        };
        this.toArray = function () { return _this.value; };
        this.isEmpty = function () { return isEmpty(_this.value); };
        this.length = function () { return _this.value.length; };
        this.reverse = function () { return new List(_this.value.reverse()); };
        this.groupBy = function (f) { return groupBy(f)(_this.value); };
        this.uniq = function () { return new List(uniq(_this.value)); };
        this.uniqBy = function (f) { return new List(uniqBy(f)(_this.value)); };
        this.optHead = function () { return optHead(_this.value); };
        this.optFind = function (f) { return optFind(f)(_this.value); };
        this.optLast = function () { return option.of(_this.value.length > 0 && _this.value[_this.value.length - 1]); };
        this.value = a;
    }
    List.of = function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return new List(a);
    };
    List.empty = function () { return new List([]); };
    List.fromArray = function (a) { return List.of.apply(List, __spread(a)); };
    return List;
}());
export { List };
export var map = function (f) { return function (listA) { return listA.map(f); }; };
export var ap = function (listAtoB) { return function (listA) { return listAtoB.ap(listA); }; };
export var chain = function (f) { return function (listA) { return listA.chain(f); }; };
export var of = function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return List.of.apply(List, __spread(a));
};
export var concat = function (listA1) { return function (listA2) { return listA1.concat(listA2); }; };
export var empty = function () { return List.empty(); };
export var list = {
    map: map,
    ap: ap,
    chain: chain,
    of: of,
    empty: empty,
    concat: concat,
};
//# sourceMappingURL=List.js.map