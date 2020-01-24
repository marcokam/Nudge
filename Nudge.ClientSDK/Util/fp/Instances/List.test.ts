import { List } from "./List";
import { option } from "./Option";
import { Task, task } from "./Task";
import { id } from "../function";

describe("List", () => {
    it("creates a list from an array and produces an array from a list", () => {
        expect(List.fromArray([1, 2, 3]).toArray()).toEqual([1, 2, 3]);
    });
    
    it("creates a list from value arguments", () => {
        expect(List.of(1, 2, 3).toArray()).toEqual([1, 2, 3]);
    });
    
    it("acts as a monoid", () => {
        expect(List.of(1, 2, 3).concat(List.empty()).toArray())
            .toEqual(List.empty<number>().concat(List.of(1, 2, 3)).toArray());

        expect(List.of(1, 2, 3).concat(List.of(4, 5, 6)).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
    });
    
    it("can reverse the list", () => {
        expect(List.of(1, 2, 3).reverse().toArray()).toEqual([3, 2, 1]);
    })
    
    it("produces a unique list of values", () => {
        expect(List.of(1, 2, 2, 3, 1, 3, 4).uniq().toArray()).toEqual([1, 2, 3, 4]);
        expect(List.of("a", "b", "a", "c", "e").uniq().toArray()).toEqual(["a", "b", "c", "e"]);
    });
    
    it("produces a unique list via a key function", () => {
        interface Turtle {
            id: number;
            name: string;
        }
        const turtles: Turtle[] = [{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 2, name: "donny" }, { id: 1, name: "leo" }, { id: 1, name: "leo" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }];
        expect(
            List.fromArray(turtles)
                .uniqBy(t => t.id)
                .toArray()
        ).toEqual([{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }]);
    });
        
    it("can fold a list of values", () => {
        expect(List.of(1, 2, 3).fold((acc, n) => acc + n, 0)).toEqual(6);
        expect(List.of(2, 3, 4).fold((acc, n) => acc * n, 1)).toEqual(24);
    });
    
    it("can filter a list", () => {
        expect(List.of(1, 2, 3).filter(x => x % 2 === 0).toArray()).toEqual([2]);
        expect(
            List.of({ name: "Mickey", age: 90 }, { name: "Donald", age: 85 })
                .filter(c => c.age < 90)
                .toArray()
        ).toEqual([{ name: "Donald", age: 85 }]);
    });
    

    it("can transform elements in the list", () => {
        expect(
            List.of(1, 2, 3)
                .map(n => n ** 2)
                .map(s => s + 1)
                .toArray()
        ).toEqual([2, 5, 10])
    });
    
    it("can apply a list of functions", () => {
        expect(
            List.of((n: number) => n + 1, (n: number) => n * 2)
                .ap(List.of(1, 2, 3))
                .toArray()
        ).toEqual([2, 2, 3, 4, 4, 6]);
        expect(
            List.of((x: string) => (y: string) => x + y)
                .ap(List.of("a", "b", "c"))
                .ap(List.of("1", "2", "3"))
                .toArray()
        ).toEqual(["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"]);
    });
    
    it("can chain List returning operations", () => {
        expect(
            List.of(1, 2, 3)
                .chain(n => List.of(n + 1))
                .toArray()
        ).toEqual([2, 3, 4])
    });
    
    it("can traverse with an applicative", async () => {
        expect(
            List.of(1, 2, 3)
                .traverse1<"Option", number>(option, (n: number) => option.of(n))
                .getOrElse(() => List.empty())
                .toArray()
        ).toEqual([1, 2, 3]);

        const taskOfNumbers = List.of(1, 2, 3)
            .traverse2<"Task", Error, number>(task, (n: number) => Task.of(n));
        expect(await taskOfNumbers.fork(id, list => list.toArray())).toEqual([1, 2, 3]);

        const optionOfNumbers = List.of(1, 2, 3)
            .traverse1<"Option", number>(option, (n: number) => option.of(n));
        expect(optionOfNumbers.getOrElse(() => List.fromArray([])).toArray()).toEqual([1, 2, 3]);
    });
});
