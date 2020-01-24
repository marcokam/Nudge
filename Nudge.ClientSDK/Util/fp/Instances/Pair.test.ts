import { Pair } from "./Pair";

describe("Pair", () => {
    it("creates a pair of 2 values, can extract an array of the pair", () => {
        expect(Pair.of(1, 2).toArray()).toEqual([1, 2]);
    });

    it("can extract the first or second", () => {
        const p = Pair.of(1, "one");
        expect(p.fst()).toEqual(1);
        expect(p.snd()).toEqual("one");
    });

    it("can map on the second", () => {
        const p = Pair.of(1, "one")
            .map(s => s.toUpperCase());
        expect(p.fst()).toEqual(1);
        expect(p.snd()).toEqual("ONE");
    });

    it("can map on both first and second", () => {
        const p = Pair.of(1, "one")
            .bimap(n => n + 1, s => s.split("").reverse().join(""));
        expect(p.fst()).toEqual(2);
        expect(p.snd()).toEqual("eno");
    });
});