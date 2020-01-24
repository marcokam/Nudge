var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { every, some, filter, map, reduce, groupBy, uniq, uniqBy, traverse1, traverse2, splitEvery } from "./array";
import { option, none as optNone, some as optSome } from "./Instances/Option";
import { task, Task } from "./Instances/Task";
import { id } from "./function";
describe("every", function () {
    it("ensures a predicate function passes for every value in an array", function () {
        var isEven = function (n) { return n % 2 === 0; };
        var isOdd = function (n) { return !isEven(n); };
        var allEven = every(isEven);
        var allOdd = every(isOdd);
        var odds = [1, 3, 5, 7, 9];
        var evens = [2, 4, 6, 8, 10];
        var mixed = [1, 2, 3, 4, 5];
        expect(allEven(odds)).toBe(false);
        expect(allEven(evens)).toBe(true);
        expect(allEven(mixed)).toBe(false);
        expect(allOdd(odds)).toBe(true);
        expect(allOdd(evens)).toBe(false);
        expect(allOdd(mixed)).toBe(false);
    });
});
describe("some", function () {
    it("ensures a predicate function passes for some value in an array", function () {
        var isEven = function (n) { return n % 2 === 0; };
        var isOdd = function (n) { return !isEven(n); };
        var someEven = some(isEven);
        var someOdd = some(isOdd);
        var odds = [1, 3, 5, 7, 9];
        var evens = [2, 4, 6, 8, 10];
        var mixed = [1, 2, 3, 4, 5];
        expect(someEven(odds)).toBe(false);
        expect(someEven(evens)).toBe(true);
        expect(someEven(mixed)).toBe(true);
        expect(someOdd(odds)).toBe(true);
        expect(someOdd(evens)).toBe(false);
        expect(someOdd(mixed)).toBe(true);
    });
});
describe("filter", function () {
    it("filters the entries of an array", function () {
        var odds = [1, 3, 5, 7, 9];
        var evens = [2, 4, 6, 8, 10];
        var all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var isEven = function (n) { return n % 2 === 0; };
        var isOdd = function (n) { return !isEven(n); };
        expect(filter(isEven)(all)).toEqual(evens);
        expect(filter(isOdd)(all)).toEqual(odds);
    });
});
describe("map", function () {
    it("maps the entries of an array", function () {
        var odds = [1, 3, 5, 7, 9];
        var evens = [2, 4, 6, 8, 10];
        var inc = function (n) { return n + 1; };
        expect(map(inc)(odds)).toEqual(evens);
    });
});
describe("reduce", function () {
    it("reduces the entries of an array", function () {
        var nums = [1, 2, 3, 4, 5];
        expect(reduce(function (acc, n) { return acc + n; }, 0)(nums)).toEqual(15);
    });
});
describe("groupBy", function () {
    it("groups the entries of an array into an object", function () {
        var turtles = [{ name: "leonardo", colour: "purple" }, { name: "donatello", colour: "purple" }, { name: "raphael", colour: "red" }, { name: "michaelangelo", colour: "orange" }];
        expect(groupBy(function (p) { return p.colour; })(turtles)).toEqual({
            purple: [{ name: "leonardo", colour: "purple" }, { name: "donatello", colour: "purple" }],
            red: [{ name: "raphael", colour: "red" }],
            orange: [{ name: "michaelangelo", colour: "orange" }],
        });
    });
});
describe("uniq", function () {
    it("returns the unique values in an array", function () {
        var values = ["one", "two", "one", "three", "five", "five", "two", "six"];
        expect(uniq(values)).toEqual(["one", "two", "three", "five", "six"]);
    });
});
describe("uniqBy", function () {
    it("returns unique elements in an array according to map function", function () {
        var turtles = [{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 2, name: "donny" }, { id: 1, name: "leo" }, { id: 1, name: "leo" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }];
        expect(uniqBy(function (t) { return t.id; })(turtles)).toEqual([{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }]);
    });
});
describe("traverse", function () {
    it("performs traverse on an array", function () { return __awaiter(void 0, void 0, void 0, function () {
        var optParse, arrayOfStrings1, optionOfNumbers1, arrayOfStrings2, optionOfNumbers2, taskParse, taskOfNumbers1, taskOfNumbers2, result1, result2, getTasks, nums, t3, result3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    optParse = function (s) { return isNaN(parseInt(s)) ? optNone : optSome(parseInt(s)); };
                    arrayOfStrings1 = ["1", "2", "3"];
                    optionOfNumbers1 = traverse1(option)(optParse)(arrayOfStrings1);
                    arrayOfStrings2 = ["1", "x", "2"];
                    optionOfNumbers2 = traverse1(option)(optParse)(arrayOfStrings2);
                    expect(optionOfNumbers1.getOrElse(function () { return []; })).toEqual([1, 2, 3]);
                    expect(optionOfNumbers2.getOrElse(function () { return []; })).toEqual([]);
                    taskParse = function (s) { return isNaN(parseInt(s)) ? Task.reject(s + " is not a number") : Task.of(parseInt(s)); };
                    taskOfNumbers1 = traverse2(task)(taskParse)(arrayOfStrings1);
                    taskOfNumbers2 = traverse2(task)(taskParse)(arrayOfStrings2);
                    return [4 /*yield*/, taskOfNumbers1.fork(id, id)];
                case 1:
                    result1 = _a.sent();
                    return [4 /*yield*/, taskOfNumbers2.fork(id, id)];
                case 2:
                    result2 = _a.sent();
                    expect(result1).toEqual([1, 2, 3]);
                    expect(result2).toEqual(new Error("x is not a number"));
                    getTasks = function (n) { return task.of([n, n + 1, n + 2]); };
                    nums = [1, 2, 3];
                    t3 = traverse2(task)(getTasks)(nums);
                    return [4 /*yield*/, t3.fork(id, id)];
                case 3:
                    result3 = _a.sent();
                    expect(result3).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("splitEvery", function () {
    it("splits an array into partitions", function () {
        var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var arr3 = [1, 2, 3, 4, 5, 6, 7, 8];
        var arr4 = [1, 2, 3, 4, 5, 6, 7];
        var s3 = splitEvery(3);
        expect(s3(arr1)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
        expect(s3(arr2)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        expect(s3(arr3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8]]);
        expect(s3(arr4)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
});
//# sourceMappingURL=array.test.js.map