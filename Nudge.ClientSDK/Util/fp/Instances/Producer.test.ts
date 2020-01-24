import Producer, { toResult, toCachedResult, toLazyPromise } from "./Producer";
import { Task } from "./Task";

type Tester = <V>(v: V, p: Producer<V>) => Promise<void>;

const toResultTester = async <V>(v: V, p: Producer<V>) => {
    const result = await Task.toPromise(toResult(p));
    expect(result).toEqual(v);
};

const toCachedResultTester = async <V>(v: V, p: Producer<V>) => {
    const result = await Task.toPromise(toCachedResult(p));
    expect(result).toEqual(v);
};

const toLazyPromiseTester = async <V>(v: V, p: Producer<V>) => {
    const result = await toLazyPromise(p)();
    expect(result).toEqual(v);
};

const testSuite = (name: string, tester: Tester) => describe("Producer " + name, () => {
    it(name + " resolves value", () => tester(1, 1));
    it(name + " resolves Promise", () => tester(2, Promise.resolve(2)));
    it(name + " resolves Result", () => tester(3, Task.of<Error,number>(3)));
    it(name + " resolves function to value", () => tester(4, () => 4));
    it(name + " resolves function to Promise", () => tester(5, () => Promise.resolve(5)));
    it(name + " resolves function to Result", () => tester(6, () => Task.of<Error,number>(6)));
});

testSuite("toResult", toResultTester);
testSuite("toCachedResult", toCachedResultTester);
testSuite("toLazyPromise", toLazyPromiseTester);
