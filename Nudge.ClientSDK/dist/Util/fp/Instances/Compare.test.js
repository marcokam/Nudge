import { Compare } from "./Compare";
import { propOr } from "../object";
var flipDir = function (f) { return function (a, b) { return f(a, b) === 0 ? 0 : f(a, b) === -1 ? 1 : -1; }; };
var ascNum = function (a, b) { return a === b ? 0 : a < b ? -1 : 1; };
var ascString = function (a, b) { return a.localeCompare(b) === 0 ? 0 : a.localeCompare(b) === -1 ? -1 : 1; };
describe("Compare", function () {
    it("wraps a comparator to be run with run", function () {
        var numCompare = Compare.of(ascNum);
        expect(numCompare.run(1, 2)).toEqual(-1);
        expect(numCompare.run(0, 0)).toEqual(0);
        expect(numCompare.run(700, 70)).toEqual(1);
    });
    it("acts as a monoid", function () {
        var c1 = Compare.of(ascNum).concat(Compare.empty());
        var c2 = Compare.empty().concat(Compare.of(ascNum));
        expect(c1.run(5, 4)).toEqual(c2.run(5, 4));
        expect(c1.run(80, 80)).toEqual(c2.run(80, 80));
        expect(c1.run(999, -5)).toEqual(c2.run(999, -5));
    });
    it("can transform the input before running", function () {
        expect([{ name: "one", value: 1 }, { name: "two", value: 2 }, { name: "three", value: 3 }]
            .sort(Compare.of(flipDir(ascNum))
            .contramap(propOr("value", 0))
            .run)).toEqual([{ name: "three", value: 3 }, { name: "two", value: 2 }, { name: "one", value: 1 }]);
    });
    it("can combine comparators together (falls through if 0)", function () {
        ;
        var ts = [{ name: "Donny", age: 2 }, { name: "Leo", age: 2 }, { name: "Raph", age: 3 }, { name: "Mikey", age: 3 }];
        expect(ts.sort(Compare.of(flipDir(ascNum))
            .contramap(function (t) { return t.age; })
            .concat(Compare.of(ascString)
            .contramap(function (t) { return t.name; }))
            .run)).toEqual([{ name: "Mikey", age: 3 }, { name: "Raph", age: 3 }, { name: "Donny", age: 2 }, { name: "Leo", age: 2 }]);
    });
});
//# sourceMappingURL=Compare.test.js.map