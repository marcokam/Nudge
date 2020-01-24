import { left, right, tryCatch } from "./Either";
import { id, compose } from "../function";
var inc = function (x) { return x + 1; };
var double = function (x) { return x * 2; };
var mult = function (x) { return function (y) { return x * y; }; };
var exclaim = function (x) { return x + "!!"; };
var e = new Error("nothing");
describe("Either", function () {
    it("obeys the Functor laws", function () {
        /**
         * 1. Identity: `F.map(id) = F`
         * 2. Composition: `F.map(compose(bc, ab)) == F.map(ab).map(bc)`
         */
        var r = right(1);
        var law1 = r.map(id).getOrElse(id) === r.getOrElse(id);
        var law2 = r.map(compose(exclaim, inc)).getOrElse(id) === r.map(inc).map(exclaim).getOrElse(id);
        expect(law1).toBe(true);
        expect(law2).toBe(true);
    });
    it("can get value when not null or undefined", function () {
        var arr = [1];
        var obj = { 1: 1 };
        var sym = Symbol();
        expect(right(1).getOrElse(id)).toEqual(1);
        expect(right("1").getOrElse(id)).toEqual("1");
        expect(right(true).getOrElse(id)).toEqual(true);
        expect(right(arr).getOrElse(id)).toEqual(arr);
        expect(right(obj).getOrElse(id)).toEqual(obj);
        expect(right(sym).getOrElse(id)).toEqual(sym);
    });
    it("always returns the same `left`", function () {
        var l1 = left(e);
        var l2 = l1.map(inc);
        var l3 = l2.ap(l1);
        var l4 = l3.chain(function () { return left(e); });
        expect(l1 === l2).toBe(true);
        expect(l1).toBe(l3);
        expect(l2).toBe(l3);
        expect(l3).toBe(l4);
    });
    it("returns a default value when null or undefined", function () {
        var l = left(e);
        expect(l.getOrElse(id)).toEqual(e);
        expect(l.getOrElse(id)).toEqual(e);
    });
    it("can map when value exists", function () {
        var r = right(1)
            .map(inc)
            .map(double)
            .map(exclaim)
            .getOrElse(id);
        expect(r).toEqual("4!!");
    });
    it("can map when null or undefined", function () {
        var l1 = left(e)
            .map(function (x) { return x ? true : false; })
            .map(function (b) { return b ? 1 : 0; })
            .getOrElse(id);
        var l2 = left(e)
            .map(function (x) { return x ? true : false; })
            .map(function (b) { return b ? 1 : 0; })
            .getOrElse(id);
        expect(l1).toEqual(e);
        expect(l2).toEqual(e);
    });
    it("returns left if any map operation fails", function () {
        var obj = { test: 123 };
        var o = right(obj);
        var r1 = o
            .map(function (x) { return x.doesnotexist.doesnotexist; })
            .getOrElse(id);
        var r2 = o
            .map(function (x) { return x.doesnotexist; })
            .getOrElse(id);
        expect(r1).toBeInstanceOf(Error);
        expect(r2).toBe(undefined);
    });
    it("can apply a function in another Either", function () {
        var r = right(1);
        var rinc = right(inc);
        expect(rinc.ap(r).getOrElse(id)).toEqual(2);
    });
    it("can apply a curried function with multiple parameters", function () {
        var r1 = right(2);
        var r2 = right(3);
        var rmult = right(mult);
        expect(rmult.ap(r1).ap(r2).getOrElse(id)).toEqual(6);
    });
    it("can chain nested Eithers into a single one", function () {
        var r = right(1);
        var unnested = r.chain(function (x) { return tryCatch(function () { return exclaim(x); }); });
        expect(unnested.getOrElse(id)).toBe("1!!");
    });
});
describe("tryCatch", function () {
    it("returns an Either on success", function () {
        var o = tryCatch(function () { return JSON.parse("{\"foo\":\"bar\"}"); });
        expect(o.map(function (x) { return x.foo; }).map(exclaim).getOrElse(function () { return ""; })).toEqual("bar!!");
    });
    it("returns an Either on error", function () {
        var o = tryCatch(function () { return JSON.parse("?@*#!(%InvalidJSON?s9d8fsdf"); });
        expect(o.getOrElse(function () { return e; })).toEqual(e);
    });
});
//# sourceMappingURL=Either.test.js.map