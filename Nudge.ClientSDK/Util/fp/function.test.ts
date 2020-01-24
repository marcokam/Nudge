import { compose, pipe, once } from "./function";

const inc = (x: number) => x + 1;
const double = (x: number) => x * 2;
const mult = (x: number, y: number) => x * y;
const exclaim = (x: number | string) => x + "!!";

describe("compose", () => {
    it("handles a single function", () => {
        const f = compose(inc);
        expect(f(1)).toEqual(2);
    });

    it("handles multiple parameters for the first function", () => {
        const f = compose(exclaim, mult);
        expect(f(2, 3)).toEqual("6!!");
    });

    it("composes up to 10 functions", () => {
        expect(compose(inc, double, inc)(2)).toEqual(7);
        expect(compose(inc, double, inc, double)(2)).toEqual(11);
        expect(compose(inc, double, inc, double, inc)(2)).toEqual(15);
        expect(compose(inc, double, inc, double, inc, double)(2)).toEqual(23);
        expect(compose(inc, double, inc, double, inc, double, inc)(2)).toEqual(31);
        expect(compose(inc, double, inc, double, inc, double, inc, double)(2)).toEqual(47);
        expect(compose(inc, double, inc, double, inc, double, inc, double, inc)(2)).toEqual(63);
        expect(compose(inc, double, inc, double, inc, double, inc, double, inc, double)(2)).toEqual(95);
    });
});

describe("pipe", () => {
    it("handles a single function", () => {
        const f = pipe(inc);
        expect(f(1)).toEqual(2);
    });

    it("handles multiple parameters for the first function", () => {
        const f = pipe(mult, exclaim);
        expect(f(2, 3)).toEqual("6!!");
    });

    it("composes up to 10 functions", () => {
        expect(pipe(inc, double, inc)(2)).toEqual(7);
        expect(pipe(double, inc, double, inc)(2)).toEqual(11);
        expect(pipe(inc, double, inc, double, inc)(2)).toEqual(15);
        expect(pipe(double, inc, double, inc, double, inc)(2)).toEqual(23);
        expect(pipe(inc, double, inc, double, inc, double, inc)(2)).toEqual(31);
        expect(pipe(double, inc, double, inc, double, inc, double, inc)(2)).toEqual(47);
        expect(pipe(inc, double, inc, double, inc, double, inc, double, inc)(2)).toEqual(63);
        expect(pipe(double, inc, double, inc, double, inc, double, inc, double, inc)(2)).toEqual(95);
    });
});

describe("once", () => {
    it("creates a function that will be called once", () => {
        const mockFn = jest.fn();
        const onceMockFn = once(mockFn);

        onceMockFn(1, 2, 3);
        expect(mockFn).toBeCalledWith(1, 2, 3);

        onceMockFn();
        onceMockFn();
        onceMockFn();
        onceMockFn();
        onceMockFn();
        expect(mockFn.mock.calls.length).toBe(1);
    });
});
