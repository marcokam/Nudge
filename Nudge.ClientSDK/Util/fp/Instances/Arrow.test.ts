import { Arrow } from "./Arrow";

const inc = (n: number) => n + 1;

describe("Arrow", () => {
    it("wraps a function to be run with run", () => {
        expect(Arrow.of(inc).run(1)).toEqual(2);
    });
    it("can transform the input before running", () => {
        const obj = { test: 42 };
        expect(Arrow.of(inc).contramap((o: { test: number }) => o.test).run(obj)).toEqual(43);
    });
    it("can transform the output after running", () => {
        expect(Arrow.of(inc).map((n: number) => `Number: ${n}`).run(1)).toEqual("Number: 2");
    })
})