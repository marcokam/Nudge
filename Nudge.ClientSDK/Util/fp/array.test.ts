import { every, some, filter, map, reduce, groupBy, uniq, uniqBy, traverse1, traverse2, splitEvery } from "./array";
import { URI as OptionURI, option, none as optNone, some as optSome } from "./Instances/Option";
import { URI as TaskURI, task, Task } from "./Instances/Task";
import { id } from "./function";

describe("every", () => {
    it("ensures a predicate function passes for every value in an array", () => {
        const isEven = (n: number) => n % 2 === 0;
        const isOdd = (n: number) => !isEven(n);
        const allEven = every(isEven);
        const allOdd = every(isOdd);
        const odds = [1, 3, 5, 7, 9];
        const evens = [2, 4, 6, 8, 10];
        const mixed = [1, 2, 3, 4, 5];

        expect(allEven(odds)).toBe(false);
        expect(allEven(evens)).toBe(true);
        expect(allEven(mixed)).toBe(false);

        expect(allOdd(odds)).toBe(true);
        expect(allOdd(evens)).toBe(false);
        expect(allOdd(mixed)).toBe(false);
    });
});

describe("some", () => {
    it("ensures a predicate function passes for some value in an array", () => {
        const isEven = (n: number) => n % 2 === 0;
        const isOdd = (n: number) => !isEven(n);
        const someEven = some(isEven);
        const someOdd = some(isOdd);
        const odds = [1, 3, 5, 7, 9];
        const evens = [2, 4, 6, 8, 10];
        const mixed = [1, 2, 3, 4, 5];

        expect(someEven(odds)).toBe(false);
        expect(someEven(evens)).toBe(true);
        expect(someEven(mixed)).toBe(true);

        expect(someOdd(odds)).toBe(true);
        expect(someOdd(evens)).toBe(false);
        expect(someOdd(mixed)).toBe(true);
    });
});

describe("filter", () => {
    it("filters the entries of an array", () => {
        const odds = [1, 3, 5, 7, 9];
        const evens = [2, 4, 6, 8, 10];
        const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const isEven = (n: number) => n % 2 === 0;
        const isOdd = (n: number) => !isEven(n);

        expect(filter(isEven)(all)).toEqual(evens);
        expect(filter(isOdd)(all)).toEqual(odds);
    });
});

describe("map", () => {
    it("maps the entries of an array", () => {
        const odds = [1, 3, 5, 7, 9];
        const evens = [2, 4, 6, 8, 10];
        const inc = (n: number) => n + 1;

        expect(map(inc)(odds)).toEqual(evens);
    });
});

describe("reduce", () => {
    it("reduces the entries of an array", () => {
        const nums = [1, 2, 3, 4, 5];

        expect(reduce<number, number>((acc, n) => acc + n, 0)(nums)).toEqual(15);
    });
});

describe("groupBy", () => {
    it("groups the entries of an array into an object", () => {
        interface Turtle {
            name: string;
            colour: string;
        }
        const turtles: Turtle[] = [{ name: "leonardo", colour: "purple" }, { name: "donatello", colour: "purple" }, { name: "raphael", colour: "red" }, { name: "michaelangelo", colour: "orange" }]

        expect(groupBy((p: Turtle) => p.colour)(turtles)).toEqual({
            purple: [{ name: "leonardo", colour: "purple" }, { name: "donatello", colour: "purple" }],
            red: [{ name: "raphael", colour: "red" }],
            orange: [{ name: "michaelangelo", colour: "orange" }],
        });
    });
});

describe("uniq", () => {
    it("returns the unique values in an array", () => {
        const values = ["one", "two", "one", "three", "five", "five", "two", "six"];

        expect(uniq(values)).toEqual(["one", "two", "three", "five", "six"]);
    });
});

describe("uniqBy", () => {
    it("returns unique elements in an array according to map function", () => {
        interface Turtle {
            id: number;
            name: string;
        }
        const turtles: Turtle[] = [{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 2, name: "donny" }, { id: 1, name: "leo" }, { id: 1, name: "leo" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }];
        expect(uniqBy<Turtle, number>(t => t.id)(turtles)).toEqual([{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }]);
    });
});

describe("traverse", () => {
    it("performs traverse on an array", async () => {
        const optParse = (s: string) => isNaN(parseInt(s)) ? optNone : optSome(parseInt(s));
        const arrayOfStrings1 = ["1", "2", "3"];
        const optionOfNumbers1 = traverse1<OptionURI, string, number>(option)(optParse)(arrayOfStrings1);
        const arrayOfStrings2 = ["1", "x", "2"];
        const optionOfNumbers2 = traverse1<OptionURI, string, number>(option)(optParse)(arrayOfStrings2);
        expect(optionOfNumbers1.getOrElse(() => [])).toEqual([1, 2, 3]);
        expect(optionOfNumbers2.getOrElse(() => [])).toEqual([]);

        const taskParse = (s: string): Task<Error, number> => isNaN(parseInt(s)) ? Task.reject(`${s} is not a number`) : Task.of(parseInt(s));
        const taskOfNumbers1 = traverse2<TaskURI, Error, string, number>(task)(taskParse)(arrayOfStrings1);
        const taskOfNumbers2 = traverse2<TaskURI, Error, string, number>(task)(taskParse)(arrayOfStrings2);
        const result1 = await taskOfNumbers1.fork(id, id);
        const result2 = await taskOfNumbers2.fork(id, id);
        expect(result1).toEqual([1, 2, 3]);
        expect(result2).toEqual(new Error("x is not a number"));

        const getTasks = (n: number) => task.of<Error, number[]>([n, n + 1, n + 2]);
        const nums = [1, 2, 3];
        const t3 = traverse2<TaskURI, Error, number, number[]>(task)(getTasks)(nums);
        const result3 = await t3.fork(id, id);
        expect(result3).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
    });
});

describe("splitEvery", () => {
    it("splits an array into partitions", () => {
        const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const arr3 = [1, 2, 3, 4, 5, 6, 7, 8];
        const arr4 = [1, 2, 3, 4, 5, 6, 7];
        const s3 = splitEvery(3);

        expect(s3(arr1)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
        expect(s3(arr2)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        expect(s3(arr3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8]]);
        expect(s3(arr4)).toEqual([[1, 2, 3], [4, 5, 6], [7]])
    });
});
