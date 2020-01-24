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
import { List } from "./List";
import { option } from "./Option";
import { Task, task } from "./Task";
import { id } from "../function";
describe("List", function () {
    it("creates a list from an array and produces an array from a list", function () {
        expect(List.fromArray([1, 2, 3]).toArray()).toEqual([1, 2, 3]);
    });
    it("creates a list from value arguments", function () {
        expect(List.of(1, 2, 3).toArray()).toEqual([1, 2, 3]);
    });
    it("acts as a monoid", function () {
        expect(List.of(1, 2, 3).concat(List.empty()).toArray())
            .toEqual(List.empty().concat(List.of(1, 2, 3)).toArray());
        expect(List.of(1, 2, 3).concat(List.of(4, 5, 6)).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it("can reverse the list", function () {
        expect(List.of(1, 2, 3).reverse().toArray()).toEqual([3, 2, 1]);
    });
    it("produces a unique list of values", function () {
        expect(List.of(1, 2, 2, 3, 1, 3, 4).uniq().toArray()).toEqual([1, 2, 3, 4]);
        expect(List.of("a", "b", "a", "c", "e").uniq().toArray()).toEqual(["a", "b", "c", "e"]);
    });
    it("produces a unique list via a key function", function () {
        var turtles = [{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 2, name: "donny" }, { id: 1, name: "leo" }, { id: 1, name: "leo" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }];
        expect(List.fromArray(turtles)
            .uniqBy(function (t) { return t.id; })
            .toArray()).toEqual([{ id: 1, name: "leo" }, { id: 2, name: "donny" }, { id: 3, name: "raph" }, { id: 4, name: "mikey" }]);
    });
    it("can fold a list of values", function () {
        expect(List.of(1, 2, 3).fold(function (acc, n) { return acc + n; }, 0)).toEqual(6);
        expect(List.of(2, 3, 4).fold(function (acc, n) { return acc * n; }, 1)).toEqual(24);
    });
    it("can filter a list", function () {
        expect(List.of(1, 2, 3).filter(function (x) { return x % 2 === 0; }).toArray()).toEqual([2]);
        expect(List.of({ name: "Mickey", age: 90 }, { name: "Donald", age: 85 })
            .filter(function (c) { return c.age < 90; })
            .toArray()).toEqual([{ name: "Donald", age: 85 }]);
    });
    it("can transform elements in the list", function () {
        expect(List.of(1, 2, 3)
            .map(function (n) { return Math.pow(n, 2); })
            .map(function (s) { return s + 1; })
            .toArray()).toEqual([2, 5, 10]);
    });
    it("can apply a list of functions", function () {
        expect(List.of(function (n) { return n + 1; }, function (n) { return n * 2; })
            .ap(List.of(1, 2, 3))
            .toArray()).toEqual([2, 2, 3, 4, 4, 6]);
        expect(List.of(function (x) { return function (y) { return x + y; }; })
            .ap(List.of("a", "b", "c"))
            .ap(List.of("1", "2", "3"))
            .toArray()).toEqual(["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"]);
    });
    it("can chain List returning operations", function () {
        expect(List.of(1, 2, 3)
            .chain(function (n) { return List.of(n + 1); })
            .toArray()).toEqual([2, 3, 4]);
    });
    it("can traverse with an applicative", function () { return __awaiter(void 0, void 0, void 0, function () {
        var taskOfNumbers, _a, optionOfNumbers;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    expect(List.of(1, 2, 3)
                        .traverse1(option, function (n) { return option.of(n); })
                        .getOrElse(function () { return List.empty(); })
                        .toArray()).toEqual([1, 2, 3]);
                    taskOfNumbers = List.of(1, 2, 3)
                        .traverse2(task, function (n) { return Task.of(n); });
                    _a = expect;
                    return [4 /*yield*/, taskOfNumbers.fork(id, function (list) { return list.toArray(); })];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual([1, 2, 3]);
                    optionOfNumbers = List.of(1, 2, 3)
                        .traverse1(option, function (n) { return option.of(n); });
                    expect(optionOfNumbers.getOrElse(function () { return List.fromArray([]); }).toArray()).toEqual([1, 2, 3]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=List.test.js.map