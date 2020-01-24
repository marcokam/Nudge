import { Pred } from "./Pred";
import { not } from "../function";
import { propOr } from "../object";
var isEven = function (n) { return n % 2 === 0; };
var gt3 = function (n) { return n > 3; };
describe("Pred", function () {
    it("wraps a predicate to be run with run", function () {
        expect(Pred.of(isEven).run(5)).toEqual(false);
    });
    it("acts as a monoid", function () {
        var p1 = Pred.of(isEven).concat(Pred.empty());
        var p2 = Pred.empty().concat(Pred.of(isEven));
        expect(p1.run(5)).toEqual(p2.run(5));
        expect(p1.run(4)).toEqual(p2.run(4));
    });
    it("can combine predicates together (conjunction)", function () {
        expect([1, 2, 3, 4, 5, 6]
            .filter(Pred.of(isEven)
            .concat(Pred.of(gt3))
            .run)).toEqual([4, 6]);
    });
    it("can transform the input before running", function () {
        expect([{ name: "one", value: 1 }, { name: "two", value: 2 }, { name: "three", value: 3 }]
            .filter(Pred.of(not(isEven))
            .concat(Pred.of(not(gt3)))
            .contramap(propOr("value", 0))
            .run)).toEqual([{ name: "one", value: 1 }, { name: "three", value: 3 }]);
    });
});
//# sourceMappingURL=Pred.test.js.map