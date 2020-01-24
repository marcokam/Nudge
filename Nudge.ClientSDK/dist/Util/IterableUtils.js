var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
import { reverseComparer, defaultComparerDescending, defaultComparerAscending } from "../Comparison/Comparers";
var alwaysPredicate = function () { return true; };
export function filter(iterable, predicate) {
    var iterable_1, iterable_1_1, item, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next();
                _b.label = 1;
            case 1:
                if (!!iterable_1_1.done) return [3 /*break*/, 4];
                item = iterable_1_1.value;
                if (!predicate(item)) return [3 /*break*/, 3];
                return [4 /*yield*/, item];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                iterable_1_1 = iterable_1.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
export function any(iterable, predicate) {
    var e_2, _a;
    var actualPredicate = predicate || alwaysPredicate;
    try {
        for (var iterable_2 = __values(iterable), iterable_2_1 = iterable_2.next(); !iterable_2_1.done; iterable_2_1 = iterable_2.next()) {
            var item = iterable_2_1.value;
            if (actualPredicate(item))
                return true;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (iterable_2_1 && !iterable_2_1.done && (_a = iterable_2.return)) _a.call(iterable_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
}
export function map(iterable, mapper) {
    var iterable_3, iterable_3_1, item, e_3_1;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                iterable_3 = __values(iterable), iterable_3_1 = iterable_3.next();
                _b.label = 1;
            case 1:
                if (!!iterable_3_1.done) return [3 /*break*/, 4];
                item = iterable_3_1.value;
                return [4 /*yield*/, mapper(item)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                iterable_3_1 = iterable_3.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_3_1 = _b.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (iterable_3_1 && !iterable_3_1.done && (_a = iterable_3.return)) _a.call(iterable_3);
                }
                finally { if (e_3) throw e_3.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
export function reduce(iterable, aggregator, start) {
    var e_4, _a;
    var acc = start;
    try {
        for (var iterable_4 = __values(iterable), iterable_4_1 = iterable_4.next(); !iterable_4_1.done; iterable_4_1 = iterable_4.next()) {
            var item = iterable_4_1.value;
            acc = aggregator(acc, item);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (iterable_4_1 && !iterable_4_1.done && (_a = iterable_4.return)) _a.call(iterable_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return acc;
}
export function first(iterable) {
    var e_5, _a;
    try {
        for (var iterable_5 = __values(iterable), iterable_5_1 = iterable_5.next(); !iterable_5_1.done; iterable_5_1 = iterable_5.next()) {
            var item = iterable_5_1.value;
            return item;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (iterable_5_1 && !iterable_5_1.done && (_a = iterable_5.return)) _a.call(iterable_5);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return null;
}
export function flatMap(iterable, mapper) {
    var iterable_6, iterable_6_1, item, _a, _b, item2, e_6_1, e_7_1;
    var e_7, _c, e_6, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 11, 12, 13]);
                iterable_6 = __values(iterable), iterable_6_1 = iterable_6.next();
                _e.label = 1;
            case 1:
                if (!!iterable_6_1.done) return [3 /*break*/, 10];
                item = iterable_6_1.value;
                _e.label = 2;
            case 2:
                _e.trys.push([2, 7, 8, 9]);
                _a = (e_6 = void 0, __values(mapper(item))), _b = _a.next();
                _e.label = 3;
            case 3:
                if (!!_b.done) return [3 /*break*/, 6];
                item2 = _b.value;
                return [4 /*yield*/, item2];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5:
                _b = _a.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_6_1 = _e.sent();
                e_6 = { error: e_6_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_6) throw e_6.error; }
                return [7 /*endfinally*/];
            case 9:
                iterable_6_1 = iterable_6.next();
                return [3 /*break*/, 1];
            case 10: return [3 /*break*/, 13];
            case 11:
                e_7_1 = _e.sent();
                e_7 = { error: e_7_1 };
                return [3 /*break*/, 13];
            case 12:
                try {
                    if (iterable_6_1 && !iterable_6_1.done && (_c = iterable_6.return)) _c.call(iterable_6);
                }
                finally { if (e_7) throw e_7.error; }
                return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}
export function uniqBy(iterable, keyFn) {
    var seen, iterable_7, iterable_7_1, item, key, e_8_1;
    var e_8, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                seen = new Set();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                iterable_7 = __values(iterable), iterable_7_1 = iterable_7.next();
                _b.label = 2;
            case 2:
                if (!!iterable_7_1.done) return [3 /*break*/, 5];
                item = iterable_7_1.value;
                key = keyFn(item);
                if (!!seen.has(key)) return [3 /*break*/, 4];
                seen.add(key);
                return [4 /*yield*/, item];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                iterable_7_1 = iterable_7.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_8_1 = _b.sent();
                e_8 = { error: e_8_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (iterable_7_1 && !iterable_7_1.done && (_a = iterable_7.return)) _a.call(iterable_7);
                }
                finally { if (e_8) throw e_8.error; }
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
export function reverse(iterable) {
    var asArray, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                asArray = Array.from(iterable);
                i = asArray.length - 1;
                _a.label = 1;
            case 1:
                if (!(i >= 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, asArray[i]];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i--;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
export function range(start, end, step) {
    var i;
    if (step === void 0) { step = 1; }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = start;
                _a.label = 1;
            case 1:
                if (!(i <= end)) return [3 /*break*/, 4];
                return [4 /*yield*/, i];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i += step;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
export function min(iterable, comparer) {
    var e_9, _a;
    var actualComparer = comparer || defaultComparerAscending;
    var result = undefined;
    try {
        for (var iterable_8 = __values(iterable), iterable_8_1 = iterable_8.next(); !iterable_8_1.done; iterable_8_1 = iterable_8.next()) {
            var item = iterable_8_1.value;
            if (result === undefined || actualComparer(result, item) > 0) {
                result = item;
            }
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (iterable_8_1 && !iterable_8_1.done && (_a = iterable_8.return)) _a.call(iterable_8);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return result;
}
export function max(iterable, comparer) {
    var actualComparer = (comparer && reverseComparer(comparer)) || defaultComparerDescending;
    return min(iterable, actualComparer);
}
export function forEach(iterable, callback) {
    var e_10, _a;
    try {
        for (var iterable_9 = __values(iterable), iterable_9_1 = iterable_9.next(); !iterable_9_1.done; iterable_9_1 = iterable_9.next()) {
            var item = iterable_9_1.value;
            callback(item);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (iterable_9_1 && !iterable_9_1.done && (_a = iterable_9.return)) _a.call(iterable_9);
        }
        finally { if (e_10) throw e_10.error; }
    }
}
//# sourceMappingURL=IterableUtils.js.map