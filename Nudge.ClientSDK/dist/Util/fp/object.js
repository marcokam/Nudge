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
import { option } from "./Instances/Option";
import { Pair } from "./Instances/Pair";
import { compose } from "./function";
export var keys = function (obj) { return Object.keys(obj); };
export var values = function (obj) { return Object.values(obj); };
export var entries = function (obj) { return Object.entries(obj); };
export var fromEntries = function (entries) { return Object.fromEntries
    ? Object.fromEntries(entries)
    : entries.reduce(function (acc, _a) {
        var _b = __read(_a, 2), k = _b[0], v = _b[1];
        acc[k] = v;
        return acc;
    }, {}); };
export var mapEntries = function (f) { return function (obj) { return entries(obj).map(function (_a) {
    var _b = __read(_a, 2), k = _b[0], v = _b[1];
    return f(k, v);
}); }; };
export var map = function (f) { return function (obj) { return compose(fromEntries, mapEntries(function (k, v) { return [k, f(k, v)]; }))(obj); }; };
export var reduce = function (f, init) { return function (obj) { return entries(obj).reduce(f, init); }; };
export var optProp = function (prop) { return function (a) { return option.of(a[prop]); }; };
export var propOr = function (prop, defaultValue) { return function (a) { return optProp(prop)(a).getOrElse(function () { return defaultValue; }); }; };
export var pick = function (props) { return function (a) { return props.reduce(function (acc, p) {
    var _a;
    return Object.assign(acc, (_a = {}, _a[p] = a[p], _a));
}, {}); }; };
export var toPairs = function (a) { return mapEntries(function (k, v) { return Pair.of(k, v); })(a); };
export var fromPairs = function (ps) { return ps.reduce(function (acc, p) {
    var _a;
    return Object.assign(acc, (_a = {}, _a[p.fst()] = p.snd(), _a));
}, {}); };
//# sourceMappingURL=object.js.map