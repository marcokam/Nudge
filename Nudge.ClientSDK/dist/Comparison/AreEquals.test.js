import * as AreEquals from "./AreEquals";
// Fixed values
var createArray = function () { return [0, 1]; };
var array1 = createArray();
var array2 = [0, 2];
var object1 = { foo: "bar" };
var object2 = { foo: "baz" };
// Helpers
var test = function (message, areEqual, x, y, expected) { return it(message, function () {
    expect(areEqual(x, y)).toBe(expected);
}); };
var testThrows = function (message, areEqual, x, y, expectedError) { return it(message, function () {
    expect(function () { return areEqual(x, y); }).toThrow(expectedError);
}); };
var createSimpleObject = function () { return ({ a: 1, b: "2" }); };
var createComplexObject = function () { return ({
    a: 1,
    b: "2",
    c: {
        d: 3,
        e: "4",
        f: {
            g: 5
        },
        g: [6, 7]
    }
}); };
var createRecursiveObject = function () {
    var h = createComplexObject();
    h.c.f.h = h;
    return h;
};
//const lazy = <T extends any>(producer: () => AreEqual<T>): AreEqual<T> => (x: T, y: T) => producer()(x, y);
var basicTests = function (name, areEqual, lenient) {
    var basicTest = function (message, x, y, expected) {
        return test(name + ": " + message, areEqual, x, y, expected);
    };
    basicTest("numbers are equal", 5, 5, true);
    basicTest("numbers are not equal", 5, 6, false);
    basicTest("strings are equal", "abc", "abc", true);
    basicTest("strings are not equal", "abc", "zzz", false);
    basicTest("arrays are equal", array1, array1, true);
    basicTest("arrays are not equal", array1, array2, false);
    basicTest("objects are equal", object1, object1, true);
    basicTest("objects are not equal", object1, object2, false);
    basicTest("booleans are equal", true, true, true);
    basicTest("booleans are not equal", true, false, false);
    basicTest("number equals string", 5, "5", lenient);
    basicTest("number equals array", 5, [5], lenient);
    basicTest("string equals arrays", "5", [5], lenient);
    basicTest("number not equals string", 5, "6", false);
    basicTest("number not equals array", 5, [6], false);
    basicTest("string not equals arrays", "5", [6], false);
    basicTest("number not equals null", 5, null, false);
    basicTest("number not equals undefined", 5, undefined, false);
    basicTest("string not equals null", "abc", null, false);
    basicTest("string not equals undefined", "abc", undefined, false);
    basicTest("array not equals null", [5], null, false);
    basicTest("array not equals undefined", [5], undefined, false);
};
// Strict equality
basicTests("strictEquals", AreEquals.strictEquals, false);
// Lenient equality
basicTests("lenientEquals", AreEquals.lenientEquals, true);
// Dates
var dt1 = new Date(100);
var dt2 = new Date(100);
var dt3 = new Date(200);
test("dateEquals: dates are strictly equal", AreEquals.dateEquals, dt1, dt1, true);
test("dateEquals: dates are lenient equal", AreEquals.dateEquals, dt1, dt2, true);
test("dateEquals: dates are not equal", AreEquals.dateEquals, dt1, dt3, false);
// RegExps
var rx1 = /pattern/g;
var rx2 = /pattern/g;
var rx3 = /pattern/i;
test("regExpEquals: regexes are strictly equal", AreEquals.regExpEquals, rx1, rx1, true);
test("regExpEquals: regexes are lenient equal", AreEquals.regExpEquals, rx1, rx2, true);
test("regExpEquals: regexes are not equal", AreEquals.regExpEquals, rx1, rx3, false);
// Shallow equality
basicTests("shallowEquals", AreEquals.shallowEquals, false);
test("shallowEquals: objects are equal (simple)", AreEquals.shallowEquals, createSimpleObject(), createSimpleObject(), true);
test("shallowEquals: objects are not equal (complex)", AreEquals.shallowEquals, createComplexObject(), createComplexObject(), false);
// Deep equality
basicTests("deepEquals", AreEquals.deepEquals, false);
test("deepEquals: arrays are equal (simple)", AreEquals.deepEquals, createArray(), createArray(), true);
test("deepEquals: arrays are equal (complex)", AreEquals.deepEquals, [createComplexObject(), createComplexObject()], [createComplexObject(), createComplexObject()], true);
test("deepEquals: objects are equal (simple)", AreEquals.deepEquals, createSimpleObject(), createSimpleObject(), true);
test("deepEquals: objects are equal (complex)", AreEquals.deepEquals, createComplexObject(), createComplexObject(), true);
test("deepEquals: objects are not equal (recursive)", AreEquals.deepEquals, createRecursiveObject(), createRecursiveObject(), false);
// deepEqualsWithDepth(Infinity)
var deepEqualsWithDepthInfinity = AreEquals.deepEqualsWithDepth(Infinity);
basicTests("deepEqualsWithDepth(Infinity)", deepEqualsWithDepthInfinity, false);
test("deepEquals: arrays are equal (simple)", deepEqualsWithDepthInfinity, createArray(), createArray(), true);
test("deepEquals: arrays are equal (complex)", deepEqualsWithDepthInfinity, createArray(), createArray(), true);
test("deepEqualsWithDepth(Infinity): objects are equal (simple)", deepEqualsWithDepthInfinity, createSimpleObject(), createSimpleObject(), true);
test("deepEqualsWithDepth(Infinity): objects are equal (complex)", deepEqualsWithDepthInfinity, createComplexObject(), createComplexObject(), true);
testThrows("deepEqualsWithDepth(Infinity): throws (recursive)", deepEqualsWithDepthInfinity, createRecursiveObject(), createRecursiveObject(), "Maximum call stack size exceeded");
//# sourceMappingURL=AreEquals.test.js.map