var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import { isBefore } from "date-fns";
import { option } from "./fp/Instances/Option";
import { Arrow } from "./fp/Instances/Arrow";
import { Pair } from "./fp/Instances/Pair";
import { fromEntries } from "./fp/object";
;
/**
 * Standard sort comparator functions for array.prototype.sort
 */
export var alphaCompareByDir = function (asc) {
    if (asc === void 0) { asc = false; }
    return function (a, b) {
        if (a === void 0) { a = ""; }
        if (b === void 0) { b = ""; }
        return (asc ? a.localeCompare(b) : b.localeCompare(a));
    };
};
export var numCompareByDir = function (asc) {
    if (asc === void 0) { asc = false; }
    return function (a, b) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        return (a === b ? 0 : (asc ? a < b : b < a) ? -1 : 1);
    };
};
export var truthyCompareByDir = function (asc) {
    if (asc === void 0) { asc = false; }
    return function (a, b) {
        if (a === void 0) { a = false; }
        if (b === void 0) { b = false; }
        return (a === b ? 0 : (asc ? !a : !b) ? -1 : 1);
    };
};
export var bothExistsCompareByDir = function (asc) {
    if (asc === void 0) { asc = false; }
    return function (a, b) { return (a && b) ? 0 : (asc ? (a ? -1 : 1) : (a ? -1 : 1)); };
};
export var dateCompare = function (asc) {
    if (asc === void 0) { asc = false; }
    return function (a, b) {
        if (a === void 0) { a = ""; }
        if (b === void 0) { b = ""; }
        return (asc ? isBefore(a, b) ? -1 : 1 : isBefore(a, b) ? 1 : -1);
    };
};
/**
 * Generate a comparator by passing in a map function to first map the inputs, then a regular comparator to do the comparing
 */
export var mapThenCompare = function (map) { return function (comparator) { return function (a, b) { return comparator(map(a), map(b)); }; }; };
/**
 * Combine multiple comparators together by falling through to next one if it returns EQ
 */
export var combineComparators = function (comparators) { return comparators
    .reduce(function (acc, comparator) { return function (a, b) { return option.of(acc(a, b))
    .map(function (res) { return res === 0 ? comparator(a, b) : res; })
    .getOrElse(function () { return 0; }); }; }, function (a, b) { return 0; }); }; // eslint-disable-line @typescript-eslint/no-unused-vars
/**
 * Custom comparators
 */
// Sort value first or last
export var sortValueLast = function (val, last) {
    if (last === void 0) { last = false; }
    return mapThenCompare(function (x) { return x === val; })(truthyCompareByDir(last));
};
// Turn an array of values into an object where the key is the string value and
//  the index in the array is the value
/**
 * Convert an array of strings into an `Ordering`, using the index as the order
 */
export var valuesToOrdering = function (values) { return values.reduce(function (acc, val, ind) {
    var _a;
    return (__assign(__assign({}, acc), (_a = {}, _a[val] = ind, _a)));
}, {}); };
var typeToOrdering = function (t) { return Object.keys(t).reduce(function (acc, val, ind) {
    var _a;
    return (__assign(__assign({}, acc), (_a = {}, _a[val] = ind, _a)));
}, {}); };
var orderingMap = function (o) { return fromEntries(Object.entries(o).map(function (_a) {
    var _b = __read(_a, 2), k = _b[0], v = _b[1];
    return [v, k];
})); };
export var generateOrdering = function (a) { return Arrow.of(function (ordering) { return Pair.of(Arrow.of(function (o) { return function (k) { return option.of(o[k]); }; }).run(ordering), Arrow.of(function (m) { return function (n) { return option.of(m[n]); }; })
    .contramap(orderingMap)
    .run(ordering)).merge(function (typeToOrdering, orderingToType) { return ({ typeToOrdering: typeToOrdering, orderingToType: orderingToType }); }); })
    .contramap(typeToOrdering)
    .run(a); };
//# sourceMappingURL=sortUtils.js.map