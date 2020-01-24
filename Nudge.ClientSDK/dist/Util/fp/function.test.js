import { compose, pipe, once } from "./function";
var inc = function (x) { return x + 1; };
var double = function (x) { return x * 2; };
var mult = function (x, y) { return x * y; };
var exclaim = function (x) { return x + "!!"; };
describe("compose", function () {
    it("handles a single function", function () {
        var f = compose(inc);
        expect(f(1)).toEqual(2);
    });
    it("handles multiple parameters for the first function", function () {
        var f = compose(exclaim, mult);
        expect(f(2, 3)).toEqual("6!!");
    });
    it("composes up to 10 functions", function () {
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
describe("pipe", function () {
    it("handles a single function", function () {
        var f = pipe(inc);
        expect(f(1)).toEqual(2);
    });
    it("handles multiple parameters for the first function", function () {
        var f = pipe(mult, exclaim);
        expect(f(2, 3)).toEqual("6!!");
    });
    it("composes up to 10 functions", function () {
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
describe("once", function () {
    it("creates a function that will be called once", function () {
        var mockFn = jest.fn();
        var onceMockFn = once(mockFn);
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
//# sourceMappingURL=function.test.js.map