var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { some, none, tryCatch } from "./Option";
import { id, compose } from "../function";
import { List, list } from "./List";
import { task, Task } from "./Task";
var inc = function (x) { return x + 1; };
var double = function (x) { return x * 2; };
var mult = function (x) { return function (y) { return x * y; }; };
var exclaim = function (x) { return x + "!!"; };
var d = "default";
describe("Option", function () {
    it("obeys the Functor laws", function () {
        /**
         * 1. Identity: `F.map(id) = F`
         * 2. Composition: `F.map(compose(bc, ab)) == F.map(ab).map(bc)`
         */
        var o = some(1);
        var law1 = o.map(id).getOrElse(function () { return NaN; }) === o.getOrElse(function () { return NaN; });
        var law2 = o.map(compose(exclaim, inc)).getOrElse(function () { return ""; }) === o.map(inc).map(exclaim).getOrElse(function () { return ""; });
        expect(law1).toBe(true);
        expect(law2).toBe(true);
    });
    it("can get value when not null or undefined", function () {
        var arr = [1];
        var obj = { 1: 1 };
        var sym = Symbol();
        expect(some(1).getOrElse(function () { return NaN; })).toEqual(1);
        expect(some("1").getOrElse(function () { return ""; })).toEqual("1");
        expect(some(true).getOrElse(function () { return false; })).toEqual(true);
        expect(some(arr).getOrElse(function () { return []; })).toEqual(arr);
        expect(some(obj).getOrElse(function () { })).toEqual(obj);
        expect(some(sym).getOrElse(function () { return undefined; })).toEqual(sym);
    });
    it("always returns the same `none`", function () {
        var n1 = none;
        var n2 = n1.map(inc);
        var n3 = n2.ap(none);
        var n4 = n3.chain(function () { return none; });
        var n5 = tryCatch(function () { return undefined; });
        var n6 = tryCatch(function () { return JSON.parse("?@*#!(%InvalidJSON?s9d8fsdf"); });
        expect(n1 === none).toBe(true);
        expect(n1).toBe(n2);
        expect(n2).toBe(n3);
        expect(n3).toBe(n4);
        expect(n4).toBe(n5);
        expect(n5).toBe(n6);
    });
    it("returns a default value when null or undefined", function () {
        expect(none.getOrElse(function () { return d; })).toEqual(d);
        expect(none.getOrElse(function () { return d; })).toEqual(d);
    });
    it("can map when value exists", function () {
        var o = some(1)
            .map(inc)
            .map(double)
            .map(exclaim)
            .getOrElse(function () { return d; });
        expect(o).toEqual("4!!");
    });
    it("can map when null or undefined", function () {
        var o1 = none
            .map(function (x) { return x ? true : false; })
            .map(function (b) { return b ? 1 : 0; })
            .getOrElse(function () { return d; });
        var o2 = none
            .map(function (x) { return x ? true : false; })
            .map(function (b) { return b ? 1 : 0; })
            .getOrElse(function () { return d; });
        expect(o1).toEqual(d);
        expect(o2).toEqual(d);
    });
    it("throws if any map operation fails", function () {
        var obj = { test: 123 };
        var o = some(obj);
        var r2 = o
            .map(function (x) { return x.doesnotexist; })
            .getOrElse(function () { return d; });
        expect(function () { return o.map(function (x) { return x.doesnotexist.doesnotexist; }); }).toThrow();
        expect(r2).toEqual(d);
    });
    it("can apply a function in another Option", function () {
        var o = some(1);
        var oinc = some(inc);
        expect(oinc.ap(o).getOrElse(function () { return NaN; })).toEqual(2);
    });
    it("can apply a curried function with multiple parameters", function () {
        var o1 = some(2);
        var o2 = some(3);
        var omult = some(mult);
        expect(omult.ap(o1).ap(o2).getOrElse(function () { return NaN; })).toEqual(6);
    });
    it("throws any ap operation fails", function () {
        var notExistProp = function (o) { return o.doesnotexist; };
        var failProp = function (o) { return o.doesnotexist.doesnotexist; };
        expect(some(notExistProp).ap(some({})).getOrElse(function () { return d; })).toBe(d);
        expect(function () { return some(failProp).ap(some({})).getOrElse(function () { return d; }); }).toThrow();
        expect(some(notExistProp).ap(none).getOrElse(function () { return d; })).toBe(d);
    });
    it("can apply if function or args are none", function () {
        expect(some(mult).ap(none).ap(some(2)).getOrElse(function () { return d; })).toBe(d);
        expect(none.ap(some(2)).ap(none).getOrElse(function () { return d; })).toBe(d);
    });
    it("can chain nested Options into a single one", function () {
        var o = some(1);
        var unnested = o.chain(function (x) { return tryCatch(function () { return exclaim(x); }); });
        expect(unnested.getOrElse(function () { return ""; })).toBe("1!!");
    });
    it("can traverse applicatives", function () { return __awaiter(void 0, void 0, void 0, function () {
        var listOfOptions, taskOfOption, result, listOfNone, taskOfNone, result2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listOfOptions = some(1)
                        .traverse1(list, function (n) { return List.of(n + 1, n + 2, n + 3); });
                    expect(listOfOptions.map(function (o) { return o.getOrElse(function () { return 0; }); }).toArray()).toEqual([2, 3, 4]);
                    taskOfOption = some(1)
                        .traverse2(task, function (n) { return Task.of(n + 1); });
                    return [4 /*yield*/, taskOfOption.fork(id, function (o) { return o.getOrElse(function () { return 0; }); })];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(2);
                    listOfNone = none
                        .traverse1(list, function (n) { return List.of(n + 1, n + 2, n + 3); });
                    expect(listOfNone.map(function (o) { return o.getOrElse(function () { return 0; }); }).toArray()).toEqual([0]);
                    taskOfNone = none
                        .traverse2(task, function (n) { return Task.of(n + 1); });
                    return [4 /*yield*/, taskOfNone.fork(id, function (o) { return o.getOrElse(function () { return 0; }); })];
                case 2:
                    result2 = _a.sent();
                    expect(result2).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("tryCatch", function () {
    it("returns an Option on success", function () {
        var o = tryCatch(function () { return JSON.parse("{\"foo\":\"bar\"}"); });
        expect(o.map(function (x) { return x.foo; }).map(exclaim).getOrElse(function () { return ""; })).toEqual("bar!!");
    });
    it("returns an Option on error", function () {
        var o = tryCatch(function () { return JSON.parse("?@*#!(%InvalidJSON?s9d8fsdf"); });
        expect(o.getOrElse(function () { return d; })).toEqual(d);
    });
    it("returns an Option when null or undefined", function () {
        var o1 = tryCatch(function () { return null; });
        var o2 = tryCatch(function () { return undefined; });
        var parms = { port: 8888 };
        var o3 = tryCatch(function () { return parms.doesnotexist; });
        expect(o1.getOrElse(function () { return d; })).toEqual(d);
        expect(o2.getOrElse(function () { return d; })).toEqual(d);
        expect(o3.getOrElse(function () { return d; })).toEqual(d);
    });
    it("returns an Option when not null or undefined", function () {
        var o1 = tryCatch(function () { return 1; });
        expect(o1.map(inc).map(double).map(exclaim).getOrElse(function () { return ""; })).toEqual("4!!");
    });
});
//# sourceMappingURL=Option.test.js.map