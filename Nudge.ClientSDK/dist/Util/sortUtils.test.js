import { alphaCompareByDir, numCompareByDir, truthyCompareByDir, mapThenCompare, combineComparators, sortValueLast } from "./sortUtils";
describe("alphaCompareByDir", function () {
    it("can generate a string sort comparator ascending", function () {
        var sortAsc = alphaCompareByDir(true);
        expect(["a", "b", "c"].sort(sortAsc)).toEqual(["a", "b", "c"]);
        expect(["b", "a", "c"].sort(sortAsc)).toEqual(["a", "b", "c"]);
        expect(["c", "b", "a"].sort(sortAsc)).toEqual(["a", "b", "c"]);
        expect(["a", "b", "b", "a"].sort(sortAsc)).toEqual(["a", "a", "b", "b"]);
    });
    it("can generate a string sort comparator descending", function () {
        var sortDsc = alphaCompareByDir(false);
        expect(["c", "b", "a"].sort(sortDsc)).toEqual(["c", "b", "a"]);
        expect(["b", "a", "c"].sort(sortDsc)).toEqual(["c", "b", "a"]);
        expect(["a", "b", "c"].sort(sortDsc)).toEqual(["c", "b", "a"]);
        expect(["a", "b", "b", "a"].sort(sortDsc)).toEqual(["b", "b", "a", "a"]);
    });
});
describe("numCompareByDir", function () {
    it("can generate a number sort comparator ascending", function () {
        var sortAsc = numCompareByDir(true);
        expect([1, 2, 3].sort(sortAsc)).toEqual([1, 2, 3]);
        expect([2, 1, 3].sort(sortAsc)).toEqual([1, 2, 3]);
        expect([3, 2, 1].sort(sortAsc)).toEqual([1, 2, 3]);
        expect([1, 2, 2, 1].sort(sortAsc)).toEqual([1, 1, 2, 2]);
    });
    it("can generate a number sort comparator descending", function () {
        var sortDsc = numCompareByDir(false);
        expect([3, 2, 1].sort(sortDsc)).toEqual([3, 2, 1]);
        expect([2, 1, 3].sort(sortDsc)).toEqual([3, 2, 1]);
        expect([1, 2, 3].sort(sortDsc)).toEqual([3, 2, 1]);
        expect([1, 2, 2, 1].sort(sortDsc)).toEqual([2, 2, 1, 1]);
    });
});
describe("truthyCompareByDir", function () {
    it("can generate a truty sort comparator ascending", function () {
        var sortAsc = truthyCompareByDir(true);
        expect([true, false, false].sort(sortAsc)).toEqual([false, false, true]);
        expect([false, false, true].sort(sortAsc)).toEqual([false, false, true]);
        expect([false, true, true].sort(sortAsc)).toEqual([false, true, true]);
    });
    it("can generate a truty sort comparator descending", function () {
        var sortDsc = truthyCompareByDir(false);
        expect([true, false, false].sort(sortDsc)).toEqual([true, false, false]);
        expect([false, false, true].sort(sortDsc)).toEqual([true, false, false]);
        expect([false, true, true].sort(sortDsc)).toEqual([true, true, false]);
    });
});
describe("mapThenCompareByDir", function () {
    it("can map input then compare", function () {
        var sortAsc = numCompareByDir(true);
        var sortDsc = numCompareByDir(false);
        expect([true, false, true].sort(mapThenCompare(function (x) { return Number(x); })(sortAsc))).toEqual([false, true, true]);
        expect(["c", "a", "z", "b", "a", "l"].sort(mapThenCompare(function (x) { return x.charCodeAt(0); })(sortDsc))).toEqual(["z", "l", "c", "b", "a", "a"]);
        var truthyAsc = truthyCompareByDir(true);
        var list = [{ name: "peter", isOld: true }, { name: "paul", isOld: true }, { name: "mary", isOld: false }];
        ;
        expect(list.sort(mapThenCompare(function (p) { return p.isOld; })(truthyAsc))).toEqual([{ name: "mary", isOld: false }, { name: "peter", isOld: true }, { name: "paul", isOld: true }]);
    });
});
describe("sortValueLast", function () {
    it("sorts specified value first or last", function () {
        var data = ["one", "two", "three"];
        expect(data.sort(sortValueLast("two", true))).toEqual(["one", "three", "two"]);
        expect(data.sort(sortValueLast("two", false))).toEqual(["two", "one", "three"]);
    });
});
describe("combineComparators", function () {
    it("combines comparators by falling through if EQ", function () {
        var data = [{ name: "Donald", age: 5, }, { name: "Donald", age: 7 }, { name: "Pluto", age: 6 }, { name: "Mickey", age: 20 }];
        var byNameThenAge = combineComparators([
            mapThenCompare(function (c) { return c.name; })(alphaCompareByDir(false)),
            mapThenCompare(function (c) { return c.age; })(numCompareByDir(false)),
        ]);
        expect(data.sort(byNameThenAge)).toEqual([{ name: "Pluto", age: 6 }, { name: "Mickey", age: 20 }, { name: "Donald", age: 7 }, { name: "Donald", age: 5, }]);
    });
});
//# sourceMappingURL=sortUtils.test.js.map