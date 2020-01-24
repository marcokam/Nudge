import { Pred } from "./Pred";
import { not } from "../function";
import { propOr } from "../object";

const isEven = (n: number) => n % 2 === 0;
const gt3 = (n: number) => n > 3;

describe("Pred", () => {
    it("wraps a predicate to be run with run", () => {
        expect(Pred.of(isEven).run(5)).toEqual(false)
    });

    it("acts as a monoid", () => {
        const p1 = Pred.of(isEven).concat(Pred.empty<number>());
        const p2 = Pred.empty<number>().concat(Pred.of(isEven));

        expect(p1.run(5)).toEqual(p2.run(5));
        expect(p1.run(4)).toEqual(p2.run(4));
    });

    it("can combine predicates together (conjunction)", () => {
        expect(
            [1, 2, 3, 4, 5, 6]
                .filter(Pred.of(isEven)
                    .concat(Pred.of(gt3))
                    .run)
        ).toEqual([4, 6])
    });

    it("can transform the input before running", () => {
        expect(
            [{ name: "one", value: 1 }, { name: "two", value: 2 }, { name: "three", value: 3 }]
                .filter(Pred.of(not(isEven))
                    .concat(Pred.of(not(gt3)))
                    .contramap(propOr("value", 0))
                    .run)
        ).toEqual([{ name: "one", value: 1 }, { name: "three", value: 3 }])
    });
});