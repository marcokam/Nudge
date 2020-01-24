import { Pair } from "./Pair";
describe("Pair", function () {
    it("creates a pair of 2 values, can extract an array of the pair", function () {
        expect(Pair.of(1, 2).toArray()).toEqual([1, 2]);
    });
    it("can extract the first or second", function () {
        var p = Pair.of(1, "one");
        expect(p.fst()).toEqual(1);
        expect(p.snd()).toEqual("one");
    });
    it("can map on the second", function () {
        var p = Pair.of(1, "one")
            .map(function (s) { return s.toUpperCase(); });
        expect(p.fst()).toEqual(1);
        expect(p.snd()).toEqual("ONE");
    });
    it("can map on both first and second", function () {
        var p = Pair.of(1, "one")
            .bimap(function (n) { return n + 1; }, function (s) { return s.split("").reverse().join(""); });
        expect(p.fst()).toEqual(2);
        expect(p.snd()).toEqual("eno");
    });
});
//# sourceMappingURL=Pair.test.js.map