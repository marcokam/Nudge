import { Task } from "./Task";
import { Lazy, id, compose } from "../function";

const inc = (x: number) => x + 1;
const double = (x: number) => x * 2;
const mult = (x: number) => (y: number) => x * y;
const exclaim = (x: number | string) => x + "!!";


describe("Task", () => {
    it("obeys the Functor laws", async () => {
        /**
         * 1. Identity: `F.map(id) = F`
         * 2. Composition: `F.map(compose(bc, ab)) == F.map(ab).map(bc)`
         */
        const t = Task.of(1);

        const l1v1 = await t.map(id).fork(id, id);
        const l1v2 = await t.fork(id, id);
        const law1 = l1v1 === l1v2;

        const l2v1 = await t.map(compose(exclaim, inc)).fork(id, id)
        const l2v2 = await t.map(inc).map(exclaim).fork(id, id);
        const law2 = l2v1 === l2v2;
        
        expect(law1).toBe(true);
        expect(law2).toBe(true);
    });

    it("does not run until run is called", async () => {
        const lazyPromise = () => Promise.resolve("result");
        const mockFn1 = jest.fn(lazyPromise);
        const mockFn2 = jest.fn();
        const mockFn3 = jest.fn(lazyPromise);
        const t1 = new Task(mockFn1);
        const t2 = Task.of(mockFn2);
        const t3 = new Task(mockFn3);
        expect(mockFn1).not.toBeCalled();

        t1.map(r => r);
        expect(mockFn1).not.toBeCalled();
        
        const t2ap = t2.ap(Task.of("anything"));
        expect(mockFn2).not.toBeCalled();
        
        const t1chain = t1.chain(() => t3);
        expect(mockFn1).not.toBeCalled();
        expect(mockFn3).not.toBeCalled();

        await t1.fork(id, id);
        expect(mockFn1).toBeCalled();
        expect(mockFn2).not.toBeCalled();
        expect(mockFn3).not.toBeCalled();

        await t2.fork(id, id);
        expect(mockFn2).not.toBeCalled();
        expect(mockFn3).not.toBeCalled();

        await t2ap.fork(id, id);
        expect(mockFn2).toBeCalled();
        expect(mockFn3).not.toBeCalled();

        await t1chain.fork(id, id);
        expect(mockFn3).toBeCalled();
    });

    it("supports mapping over functions", async () => {
        const r = await Task.of(1)
            .map(inc)
            .map(double)
            .map(exclaim)
            .fork(id, id);

        expect(r).toBe("4!!");
    });

    it("can apply a function in another Task", async () => {
        const t = Task.of(1);
        const tinc = Task.of(inc);
        const r = await tinc.ap(t).fork(id, id);

        expect(r).toEqual(2);
    });

    it("can apply a curried function with multiple parameters", async () => {
        const t1 = Task.of(2);
        const t2 = Task.of(3);
        const tmult = Task.of(mult);
        const r = await tmult.ap(t1).ap(t2).fork(id, id);

        expect(r).toEqual(6);
    });

    it("can chain nested Tasks into a single one", async () => {
        const t = Task.of(1);
        const unnested = t.chain(x => Task.of(x).map(exclaim));
        const r = await unnested.fork(id, id);
        expect(r).toBe("1!!");
    });

    it("can make a task of an existing promise", async () => {
        const p = Promise.resolve(1);
        const t = Task.of(p)
            .map(inc)
            .map(double)
            .map(exclaim);
        const r = await t.fork(id, id);
        expect(r).toBe("4!!");
    });

    it("can be used to call fetch like apis", async () => {
        interface Result {
            result: {
                port: number;
            };
        };
        const mockFn = jest.fn();
        const api: Lazy<Promise<Result>> = () => new Promise((resolve) => {
            setTimeout(() => {
                mockFn();
                const r: Result = {
                    result: {
                        port: 8888,
                    }
                };
                resolve(r);
            }, 2000);
        });

        const t = new Task(api);

        expect(mockFn).not.toBeCalled();

        const computation = t
            .map(o => o.result)
            .map(r => r.port)
            .map(p => p + 1111);

        
        const newPort = await computation.fork(id, id);
        expect(mockFn).toBeCalled();
        expect(newPort).toBe(9999);
    });

    it("handles errors on initial promise", async () => {
        interface Result {
            result: {
                port: number;
            };
        };
        const mockFn = jest.fn(id);
        const e = new Error("rejected");
        const p = Promise.reject(e);
        const t = Task.of<Error, Result>(p);
        const computation = t
            .map(o => o.result)
            .map(r => r.port)
            .map(p => p + 1111);

        const newPort = await computation.fork(mockFn, id);
        expect(mockFn).toBeCalled;
        expect(newPort).toBe(e);
    });

    it("handles errors on subsequent operations", async () => {
        interface Obj {
            [key: string]: any;
        };
        const api: Lazy<Promise<Obj>> = () => new Promise((resolve) => {
            setTimeout(() => {
                const r: Obj = {
                    result: {
                        port: 8888,
                    }
                };
                resolve(r);
            }, 2000);
        });

        const t = new Task(api);
        const newPort = await t
            .map(o => o.doesnotexist.doesnotexist)
            .fork(id, id);

        expect(newPort instanceof Error).toBe(true);
    });
});
