import { some, none, tryCatch } from "./Option";
import { id, compose } from "../function";
import { List, list } from "./List";
import { task, Task } from "./Task";

const inc = (x: number) => x + 1;
const double = (x: number) => x * 2;
const mult = (x: number) => (y: number) => x * y;
const exclaim = (x: number | string) => x + "!!";
const d = "default";


describe("Option", () => {
    it("obeys the Functor laws", () => {
        /**
         * 1. Identity: `F.map(id) = F`
         * 2. Composition: `F.map(compose(bc, ab)) == F.map(ab).map(bc)`
         */
        const o = some(1);
        const law1 = o.map(id).getOrElse(() => NaN) === o.getOrElse(() => NaN);
        const law2 = o.map(compose(exclaim, inc)).getOrElse(() => "") === o.map(inc).map(exclaim).getOrElse(() => "");
        
        expect(law1).toBe(true);
        expect(law2).toBe(true);
    });

    it("can get value when not null or undefined", () => {
        const arr = [1];
        const obj = { 1: 1 };
        const sym = Symbol();

        expect(some(1).getOrElse(() => NaN)).toEqual(1);
        expect(some("1").getOrElse(() => "")).toEqual("1");
        expect(some(true).getOrElse(() => false)).toEqual(true);
        expect(some(arr).getOrElse(() => [])).toEqual(arr);
        expect(some(obj).getOrElse(() => {})).toEqual(obj);
        expect(some(sym).getOrElse(() => undefined)).toEqual(sym);
    });

    it("always returns the same `none`", () => {
        const n1 = none;
        const n2 = n1.map(inc);
        const n3 = n2.ap(none);
        const n4 = n3.chain(() => none);
        const n5 = tryCatch(() => undefined);
        const n6 = tryCatch(() => JSON.parse("?@*#!(%InvalidJSON?s9d8fsdf"));

        expect(n1 === none).toBe(true);
        expect(n1).toBe(n2);
        expect(n2).toBe(n3);
        expect(n3).toBe(n4);
        expect(n4).toBe(n5);
        expect(n5).toBe(n6);
    });

    it("returns a default value when null or undefined", () => {
        expect(none.getOrElse(() => d)).toEqual(d);
        expect(none.getOrElse(() => d)).toEqual(d);
    });

    it("can map when value exists", () => {
        const o = some(1)
            .map(inc)
            .map(double)
            .map(exclaim)
            .getOrElse(() => d);

        expect(o).toEqual("4!!");
    });

    it("can map when null or undefined", () => {
        const o1 = none
            .map(x => x ? true : false)
            .map(b => b ? 1 : 0)
            .getOrElse(() => d);
        const o2 = none
            .map(x => x ? true : false)
            .map(b => b ? 1 : 0)
            .getOrElse(() => d);

        expect(o1).toEqual(d);
        expect(o2).toEqual(d);
    });

    it("throws if any map operation fails", () => {
        const obj: { [key: string]: any } = { test: 123 };
        const o = some(obj);
        const r2 = o
            .map(x => x.doesnotexist)
            .getOrElse(() => d);

        expect(() => o.map(x => x.doesnotexist.doesnotexist)).toThrow();
        expect(r2).toEqual(d);
    });

    it("can apply a function in another Option", () => {
        const o = some(1);
        const oinc = some(inc);
        expect(oinc.ap(o).getOrElse(() => NaN)).toEqual(2);
    });

    it("can apply a curried function with multiple parameters", () => {
        const o1 = some(2);
        const o2 = some(3);
        const omult = some(mult);
        expect(omult.ap(o1).ap(o2).getOrElse(() => NaN)).toEqual(6);
    });

    it("throws any ap operation fails", () => {
        const notExistProp = (o: { [key: string]: any }) => o.doesnotexist;
        const failProp = (o: { [key: string]: any }) => o.doesnotexist.doesnotexist;
        
        expect(some(notExistProp).ap(some({})).getOrElse(() => d)).toBe(d);
        expect(() => some(failProp).ap(some({})).getOrElse(() => d)).toThrow();
        expect(some(notExistProp).ap(none).getOrElse(() => d)).toBe(d);
    });

    it("can apply if function or args are none", () => {
        expect(some(mult).ap(none).ap(some(2)).getOrElse(() => d)).toBe(d);
        expect(none.ap(some(2)).ap(none).getOrElse(() => d)).toBe(d);
    });

    it("can chain nested Options into a single one", () => {
        const o = some(1);
        const unnested = o.chain(x => tryCatch(() => exclaim(x)));
        expect(unnested.getOrElse(() => "")).toBe("1!!");
    });

    it("can traverse applicatives", async () => {
        const listOfOptions = some(1)
            .traverse1<"List", number>(list, n => List.of(n + 1, n + 2, n + 3))
        expect(listOfOptions.map(o => o.getOrElse(() => 0)).toArray()).toEqual([2, 3, 4]);

        const taskOfOption = some(1)
            .traverse2<"Task", Error, number>(task, n => Task.of(n + 1));
        const result = await taskOfOption.fork(id, o => o.getOrElse(() => 0));
        expect(result).toEqual(2);

        const listOfNone = none
            .traverse1<"List", number>(list, (n: number) => List.of(n + 1, n + 2, n + 3));
        expect(listOfNone.map(o => o.getOrElse(() => 0)).toArray()).toEqual([0]);

        const taskOfNone = none
            .traverse2<"Task", Error, number>(task, (n: number) => Task.of(n + 1)); 
        const result2 = await taskOfNone.fork(id, o => o.getOrElse(() => 0));
        expect(result2).toEqual(0);
    });
});

describe("tryCatch", () => {
    it("returns an Option on success", () => {
        const o = tryCatch(() => JSON.parse(`{"foo":"bar"}`));

        expect(o.map(x => x.foo).map(exclaim).getOrElse(() => "")).toEqual("bar!!");
    });

    it("returns an Option on error", () => {
        const o = tryCatch(() => JSON.parse("?@*#!(%InvalidJSON?s9d8fsdf"));

        expect(o.getOrElse(() => d)).toEqual(d);
    });

    it("returns an Option when null or undefined", () => {
        const o1 = tryCatch(() => null);
        const o2 = tryCatch(() => undefined);
        const parms: { [key: string]: any } = { port: 8888 };
        const o3 = tryCatch(() => parms.doesnotexist);

        expect(o1.getOrElse(() => d)).toEqual(d);
        expect(o2.getOrElse(() => d)).toEqual(d);
        expect(o3.getOrElse(() => d)).toEqual(d);
    });

    it("returns an Option when not null or undefined", () => {
        const o1 = tryCatch(() => 1);

        expect(o1.map(inc).map(double).map(exclaim).getOrElse(() => "")).toEqual("4!!");
    });
});

