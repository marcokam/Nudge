import { left, right, tryCatch } from "./Either";
import { id, compose } from "../function";

const inc = (x: number) => x + 1;
const double = (x: number) => x * 2;
const mult = (x: number) => (y: number) => x * y;
const exclaim = (x: number | string) => x + "!!";
const e = new Error("nothing");


describe("Either", () => {
    it("obeys the Functor laws", () => {
        /**
         * 1. Identity: `F.map(id) = F`
         * 2. Composition: `F.map(compose(bc, ab)) == F.map(ab).map(bc)`
         */
        const r = right(1);
        const law1 = r.map(id).getOrElse(id) === r.getOrElse(id);
        const law2 = r.map(compose(exclaim, inc)).getOrElse(id) === r.map(inc).map(exclaim).getOrElse(id);
        
        expect(law1).toBe(true);
        expect(law2).toBe(true);
    });

    it("can get value when not null or undefined", () => {
        const arr = [1];
        const obj = { 1: 1 };
        const sym = Symbol();

        expect(right(1).getOrElse(id)).toEqual(1);
        expect(right("1").getOrElse(id)).toEqual("1");
        expect(right(true).getOrElse(id)).toEqual(true);
        expect(right(arr).getOrElse(id)).toEqual(arr);
        expect(right(obj).getOrElse(id)).toEqual(obj);
        expect(right(sym).getOrElse(id)).toEqual(sym);
    });

    it("always returns the same `left`", () => {
        const l1 = left(e);
        const l2 = l1.map(inc);
        const l3 = l2.ap(l1);
        const l4 = l3.chain(() => left(e));

        expect(l1 === l2).toBe(true);
        expect(l1).toBe(l3);
        expect(l2).toBe(l3);
        expect(l3).toBe(l4);
    });

    it("returns a default value when null or undefined", () => {
        const l = left(e);
        expect(l.getOrElse(id)).toEqual(e);
        expect(l.getOrElse(id)).toEqual(e);
    });

    it("can map when value exists", () => {
        const r = right(1)
            .map(inc)
            .map(double)
            .map(exclaim)
            .getOrElse(id);

        expect(r).toEqual("4!!");
    });

    it("can map when null or undefined", () => {
        const l1 = left(e)
            .map(x => x ? true : false)
            .map(b => b ? 1 : 0)
            .getOrElse(id);
        const l2 = left(e)
            .map(x => x ? true : false)
            .map(b => b ? 1 : 0)
            .getOrElse(id);

        expect(l1).toEqual(e);
        expect(l2).toEqual(e);
    });

    it("returns left if any map operation fails", () => {
        const obj: { [key: string]: any } = { test: 123 };
        const o = right(obj);
        const r1 = o
            .map(x => x.doesnotexist.doesnotexist)
            .getOrElse(id);
        const r2 = o
            .map(x => x.doesnotexist)
            .getOrElse(id);

        expect(r1).toBeInstanceOf(Error);
        expect(r2).toBe(undefined);
    });

    it("can apply a function in another Either", () => {
        const r = right(1);
        const rinc = right(inc);
        expect(rinc.ap(r).getOrElse(id)).toEqual(2);
    });

    it("can apply a curried function with multiple parameters", () => {
        const r1 = right(2);
        const r2 = right(3);
        const rmult = right(mult);
        expect(rmult.ap(r1).ap(r2).getOrElse(id)).toEqual(6);
    });

    it("can chain nested Eithers into a single one", () => {
        const r = right(1);
        const unnested = r.chain(x => tryCatch(() => exclaim(x)));
        expect(unnested.getOrElse(id)).toBe("1!!");
    });
});

describe("tryCatch", () => {
    it("returns an Either on success", () => {
        const o = tryCatch(() => JSON.parse(`{"foo":"bar"}`));

        expect(o.map(x => x.foo).map(exclaim).getOrElse(() => "")).toEqual("bar!!");
    });

    it("returns an Either on error", () => {
        const o = tryCatch(() => JSON.parse("?@*#!(%InvalidJSON?s9d8fsdf"));

        expect(o.getOrElse(() => e)).toEqual(e);
    });
});
