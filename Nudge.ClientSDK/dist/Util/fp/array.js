var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
import { compose, id } from "./function";
import { tryCatch, option } from "./Instances/Option";
/**
 * Array utils
 */
export var reverse = function (as) { return as.reverse(); };
export var sort = function (f) { return function (as) { return as.sort(f); }; };
export var every = function (f) { return function (as) {
    if (as === void 0) { as = []; }
    return as.every(f);
}; };
export var some = function (f) { return function (as) {
    if (as === void 0) { as = []; }
    return as.some(f);
}; };
export var filter = function (f) { return function (as) {
    if (as === void 0) { as = []; }
    return as.filter(f);
}; };
export var filterUndef = function (ts) { return ts.filter(function (t) { return !!t; }); };
export var map = function (f) { return function (as) {
    if (as === void 0) { as = []; }
    return as.map(f);
}; };
export var reduce = function (f, init) { return function (as) {
    if (as === void 0) { as = []; }
    return as.reduce(f, init);
}; };
export var flatten = function (a) {
    var e_1, _a;
    if ("flatMap" in Array.prototype)
        return a.flatMap(id);
    var result = [];
    try {
        for (var a_1 = __values(a), a_1_1 = a_1.next(); !a_1_1.done; a_1_1 = a_1.next()) {
            var arr = a_1_1.value;
            result = result.concat(arr);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (a_1_1 && !a_1_1.done && (_a = a_1.return)) _a.call(a_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
};
export var groupBy = function (f) { return function (as) {
    if (as === void 0) { as = []; }
    return reduce(function (acc, v) {
        var _a = __read([f(v), acc[f(v)]], 2), nextK = _a[0], _b = _a[1], oldV = _b === void 0 ? [] : _b;
        acc[nextK] = oldV.concat(v);
        return acc;
    }, {})(as);
}; };
export var uniq = function (as) {
    if (as === void 0) { as = []; }
    return as.length === 0 ? as : Array.from(new Set(as));
};
export var uniqBy = function (f) { return function (as) {
    if (as === void 0) { as = []; }
    return as.length === 0 ? as : compose(map(function (_a) {
        var _b = __read(_a, 2), _ = _b[0], a = _b[1];
        return a;
    }), function (kvs) { return Array.from(new Map(kvs)); }, map(function (a) { return [f(a), a]; }))(as);
}; };
export var optHead = function (as) {
    if (as === void 0) { as = []; }
    return tryCatch(function () { return as[0]; });
};
export var head = function (as) {
    if (as === void 0) { as = []; }
    return optHead(as).getOrElse(function () { return undefined; });
};
export var tail = function (as) {
    if (as === void 0) { as = []; }
    return as.slice(1);
};
export var optLast = function (as) {
    if (as === void 0) { as = []; }
    return tryCatch(function () { return as[as.length - 1]; });
};
export var last = function (as) {
    if (as === void 0) { as = []; }
    return optLast(as).getOrElse(function () { return undefined; });
};
export var range = function (a, b) { return b ? __spread(Array(b - a).keys()).map(function (n) { return n + a; }) : __spread(Array(a).keys()); };
export var isEmpty = function (as) { return as.length === 0; };
export var optFind = function (f) { return function (as) { return option.of(as.find(f)); }; };
export var empty = [];
export var traverse1 = function (F) { return function (f) { return function (as) {
    return as.reduce(function (acc, a) { return F.ap(F.map(function (bs) { return function (b) { return bs.concat([b]); }; })(acc))(f(a)); }, F.of(empty));
}; }; };
export var traverse2 = function (F) { return function (f) { return function (as) {
    return as.reduce(function (acc, a) { return F.ap(F.map(function (bs) { return function (b) { return bs.concat([b]); }; })(acc))(f(a)); }, F.of(empty));
}; }; };
export var sequence1 = function (F) { return traverse1(F)(id); };
export var sequence2 = function (F) { return traverse2(F)(id); };
export var splitEvery = function (n) { return function (as) { return as.reduce(function (acc, a) {
    var lst = last(acc);
    if (lst && lst.length < n)
        lst.push(a);
    else
        acc.push([a]);
    return acc;
}, []); }; };
//# sourceMappingURL=array.js.map