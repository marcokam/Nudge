import { keys, values, entries, fromEntries, mapEntries, propOr, pick } from "./object";
describe("keys", function () {
    it("returns an array of keys on an object", function () {
        var o = { "test1": "anything1", "test2": "anything2", "test3": "anything3" };
        expect(keys(o)).toEqual(["test1", "test2", "test3"]);
    });
});
describe("values", function () {
    it("returns an array of values on an object", function () {
        var o = { "test1": "anything1", "test2": "anything2", "test3": "anything3" };
        expect(values(o)).toEqual(["anything1", "anything2", "anything3"]);
    });
});
describe("entries", function () {
    it("returns an array of key value pairs on an object", function () {
        var o = { "test1": "anything1", "test2": "anything2", "test3": "anything3" };
        expect(entries(o)).toEqual([["test1", "anything1"], ["test2", "anything2"], ["test3", "anything3"]]);
    });
});
describe("fromEntries", function () {
    it("creates an object from an array of key value pairs", function () {
        expect(fromEntries([["test1", "anything1"], ["test2", "anything2"], ["test3", "anything3"]])).toEqual({ "test1": "anything1", "test2": "anything2", "test3": "anything3" });
    });
});
describe("map", function () {
    it("maps a function on the key value pairs of an object", function () {
        expect(mapEntries(function (k, v) { return ([k, v + "!"]); })({ "test1": "anything1", "test2": "anything2", "test3": "anything3" })).toEqual([["test1", "anything1!"], ["test2", "anything2!"], ["test3", "anything3!"]]);
    });
});
describe("propOr", function () {
    var person = { name: "Charlie" };
    var personName = propOr("name", "No Name");
    it("returns default when object not defined", function () {
        expect(personName({})).toEqual("No Name");
    });
    it("returns default when property doesn't exist on object", function () {
        expect(personName({})).toEqual("No Name");
    });
    it("returns the property value when exists on object", function () {
        expect(personName(person)).toBe("Charlie");
    });
});
describe("pick", function () {
    it("picks props off of an object", function () {
        var person = { name: "Charles", age: 12, location: "Toronto" };
        expect(pick(["name"])(person)).toEqual({ name: "Charles" });
        expect(pick(["name", "age"])(person)).toEqual({ name: "Charles", age: 12 });
        expect(pick(["name", "age", "doesnotexist"])(person)).toEqual({ name: "Charles", age: 12 });
    });
});
//# sourceMappingURL=object.test.js.map