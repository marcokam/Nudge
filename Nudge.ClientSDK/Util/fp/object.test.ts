import { keys, values, entries, fromEntries, mapEntries, propOr, pick } from "./object";

describe("keys", () => {
    it("returns an array of keys on an object", () => {
        const o = {"test1": "anything1", "test2": "anything2", "test3": "anything3"};
        expect(keys(o)).toEqual(["test1", "test2", "test3"]);
    })
});

describe("values", () => {
    it("returns an array of values on an object", () => {
        const o = {"test1": "anything1", "test2": "anything2", "test3": "anything3"};
        expect(values(o)).toEqual(["anything1", "anything2", "anything3"]);
    });
})

describe("entries", () => {
    it("returns an array of key value pairs on an object", () => {
        const o = {"test1": "anything1", "test2": "anything2", "test3": "anything3"};
        expect(entries(o)).toEqual([["test1", "anything1"], ["test2", "anything2"], ["test3", "anything3"]]);
    })
});

describe("fromEntries", () => {
    it("creates an object from an array of key value pairs", () => {
        expect(fromEntries([["test1", "anything1"], ["test2", "anything2"], ["test3", "anything3"]])).toEqual({"test1": "anything1", "test2": "anything2", "test3": "anything3"});
    });
});

describe("map", () => {
    it("maps a function on the key value pairs of an object", () => {
        expect(mapEntries((k, v) => ([k, v + "!"]))({"test1": "anything1", "test2": "anything2", "test3": "anything3"})).toEqual([["test1", "anything1!"], ["test2", "anything2!"], ["test3", "anything3!"]])
    });
});

describe("propOr", () => {
    const person = { name: "Charlie" };
    const personName = propOr("name", "No Name");

    it("returns default when object not defined", () => {
        expect(personName({})).toEqual("No Name");
    });

    it("returns default when property doesn't exist on object", () => {
        expect(personName({})).toEqual("No Name");
    });

    it("returns the property value when exists on object", () => {
        expect(personName(person)).toBe("Charlie");
    });
});

describe("pick", () => {
    it("picks props off of an object", () => {
        const person = { name: "Charles", age: 12, location: "Toronto" };
        expect(pick(["name"])(person)).toEqual({ name: "Charles" });
        expect(pick(["name", "age"])(person)).toEqual({ name: "Charles", age: 12 });
        expect(pick(["name", "age", "doesnotexist"])(person)).toEqual({ name: "Charles", age: 12 });
    });
});