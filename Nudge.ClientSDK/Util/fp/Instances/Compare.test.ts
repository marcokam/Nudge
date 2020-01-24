import { Compare } from "./Compare";
import { propOr } from "../object";
import { Comparator } from "../function";

const flipDir = <A>(f: Comparator<A>) => (a: A, b: A) => f(a, b) === 0 ? 0 : f(a, b) === -1 ? 1 : -1;
const ascNum = (a: number, b: number) => a === b ? 0 : a < b ? -1 : 1;
const ascString = (a: string, b: string) => a.localeCompare(b) === 0 ? 0 : a.localeCompare(b) === -1 ? -1 : 1;

describe("Compare", () => {

    it("wraps a comparator to be run with run", () => {
        const numCompare = Compare.of(ascNum);
        expect(numCompare.run(1, 2)).toEqual(-1);
        expect(numCompare.run(0, 0)).toEqual(0);
        expect(numCompare.run(700, 70)).toEqual(1);
    });

    it("acts as a monoid", () => {
        const c1 = Compare.of(ascNum).concat(Compare.empty<number>());
        const c2 = Compare.empty<number>().concat(Compare.of(ascNum));

        expect(c1.run(5, 4)).toEqual(c2.run(5, 4));
        expect(c1.run(80, 80)).toEqual(c2.run(80, 80));
        expect(c1.run(999, -5)).toEqual(c2.run(999, -5));
    });

    it("can transform the input before running", () => {
        expect(
            [{ name: "one", value: 1 }, { name: "two", value: 2 }, { name: "three", value: 3 }]
                .sort(Compare.of(flipDir(ascNum))
                    .contramap(propOr("value", 0))
                    .run)
        ).toEqual([{ name: "three", value: 3 }, { name: "two", value: 2 }, { name: "one", value: 1 }])
    });

    it("can combine comparators together (falls through if 0)", () => {
        interface T {
            name: string;
            age: number;
        };
        const ts: T[] = [{ name: "Donny", age: 2 }, { name: "Leo", age: 2 }, { name: "Raph", age: 3 }, { name: "Mikey", age: 3 }];

        expect(
            ts.sort(Compare.of(flipDir(ascNum))
                .contramap((t: T) => t.age)
                .concat(Compare.of(ascString)
                    .contramap((t: T) => t.name))
                .run)
        ).toEqual([{ name: "Mikey", age: 3 }, { name: "Raph", age: 3 }, { name: "Donny", age: 2 }, { name: "Leo", age: 2 }]);
    });
});