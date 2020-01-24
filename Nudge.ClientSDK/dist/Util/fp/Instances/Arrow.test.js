import { Arrow } from "./Arrow";
var inc = function (n) { return n + 1; };
describe("Arrow", function () {
    it("wraps a function to be run with run", function () {
        expect(Arrow.of(inc).run(1)).toEqual(2);
    });
    it("can transform the input before running", function () {
        var obj = { test: 42 };
        expect(Arrow.of(inc).contramap(function (o) { return o.test; }).run(obj)).toEqual(43);
    });
    it("can transform the output after running", function () {
        expect(Arrow.of(inc).map(function (n) { return "Number: " + n; }).run(1)).toEqual("Number: 2");
    });
});
//# sourceMappingURL=Arrow.test.js.map