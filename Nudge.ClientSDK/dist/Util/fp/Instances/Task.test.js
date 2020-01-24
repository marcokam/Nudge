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
import { Task } from "./Task";
import { id, compose } from "../function";
var inc = function (x) { return x + 1; };
var double = function (x) { return x * 2; };
var mult = function (x) { return function (y) { return x * y; }; };
var exclaim = function (x) { return x + "!!"; };
describe("Task", function () {
    it("obeys the Functor laws", function () { return __awaiter(void 0, void 0, void 0, function () {
        var t, l1v1, l1v2, law1, l2v1, l2v2, law2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = Task.of(1);
                    return [4 /*yield*/, t.map(id).fork(id, id)];
                case 1:
                    l1v1 = _a.sent();
                    return [4 /*yield*/, t.fork(id, id)];
                case 2:
                    l1v2 = _a.sent();
                    law1 = l1v1 === l1v2;
                    return [4 /*yield*/, t.map(compose(exclaim, inc)).fork(id, id)];
                case 3:
                    l2v1 = _a.sent();
                    return [4 /*yield*/, t.map(inc).map(exclaim).fork(id, id)];
                case 4:
                    l2v2 = _a.sent();
                    law2 = l2v1 === l2v2;
                    expect(law1).toBe(true);
                    expect(law2).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("does not run until run is called", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lazyPromise, mockFn1, mockFn2, mockFn3, t1, t2, t3, t2ap, t1chain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lazyPromise = function () { return Promise.resolve("result"); };
                    mockFn1 = jest.fn(lazyPromise);
                    mockFn2 = jest.fn();
                    mockFn3 = jest.fn(lazyPromise);
                    t1 = new Task(mockFn1);
                    t2 = Task.of(mockFn2);
                    t3 = new Task(mockFn3);
                    expect(mockFn1).not.toBeCalled();
                    t1.map(function (r) { return r; });
                    expect(mockFn1).not.toBeCalled();
                    t2ap = t2.ap(Task.of("anything"));
                    expect(mockFn2).not.toBeCalled();
                    t1chain = t1.chain(function () { return t3; });
                    expect(mockFn1).not.toBeCalled();
                    expect(mockFn3).not.toBeCalled();
                    return [4 /*yield*/, t1.fork(id, id)];
                case 1:
                    _a.sent();
                    expect(mockFn1).toBeCalled();
                    expect(mockFn2).not.toBeCalled();
                    expect(mockFn3).not.toBeCalled();
                    return [4 /*yield*/, t2.fork(id, id)];
                case 2:
                    _a.sent();
                    expect(mockFn2).not.toBeCalled();
                    expect(mockFn3).not.toBeCalled();
                    return [4 /*yield*/, t2ap.fork(id, id)];
                case 3:
                    _a.sent();
                    expect(mockFn2).toBeCalled();
                    expect(mockFn3).not.toBeCalled();
                    return [4 /*yield*/, t1chain.fork(id, id)];
                case 4:
                    _a.sent();
                    expect(mockFn3).toBeCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it("supports mapping over functions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Task.of(1)
                        .map(inc)
                        .map(double)
                        .map(exclaim)
                        .fork(id, id)];
                case 1:
                    r = _a.sent();
                    expect(r).toBe("4!!");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can apply a function in another Task", function () { return __awaiter(void 0, void 0, void 0, function () {
        var t, tinc, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = Task.of(1);
                    tinc = Task.of(inc);
                    return [4 /*yield*/, tinc.ap(t).fork(id, id)];
                case 1:
                    r = _a.sent();
                    expect(r).toEqual(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can apply a curried function with multiple parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, tmult, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t1 = Task.of(2);
                    t2 = Task.of(3);
                    tmult = Task.of(mult);
                    return [4 /*yield*/, tmult.ap(t1).ap(t2).fork(id, id)];
                case 1:
                    r = _a.sent();
                    expect(r).toEqual(6);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can chain nested Tasks into a single one", function () { return __awaiter(void 0, void 0, void 0, function () {
        var t, unnested, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = Task.of(1);
                    unnested = t.chain(function (x) { return Task.of(x).map(exclaim); });
                    return [4 /*yield*/, unnested.fork(id, id)];
                case 1:
                    r = _a.sent();
                    expect(r).toBe("1!!");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can make a task of an existing promise", function () { return __awaiter(void 0, void 0, void 0, function () {
        var p, t, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = Promise.resolve(1);
                    t = Task.of(p)
                        .map(inc)
                        .map(double)
                        .map(exclaim);
                    return [4 /*yield*/, t.fork(id, id)];
                case 1:
                    r = _a.sent();
                    expect(r).toBe("4!!");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can be used to call fetch like apis", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFn, api, t, computation, newPort;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    mockFn = jest.fn();
                    api = function () { return new Promise(function (resolve) {
                        setTimeout(function () {
                            mockFn();
                            var r = {
                                result: {
                                    port: 8888,
                                }
                            };
                            resolve(r);
                        }, 2000);
                    }); };
                    t = new Task(api);
                    expect(mockFn).not.toBeCalled();
                    computation = t
                        .map(function (o) { return o.result; })
                        .map(function (r) { return r.port; })
                        .map(function (p) { return p + 1111; });
                    return [4 /*yield*/, computation.fork(id, id)];
                case 1:
                    newPort = _a.sent();
                    expect(mockFn).toBeCalled();
                    expect(newPort).toBe(9999);
                    return [2 /*return*/];
            }
        });
    }); });
    it("handles errors on initial promise", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFn, e, p, t, computation, newPort;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    mockFn = jest.fn(id);
                    e = new Error("rejected");
                    p = Promise.reject(e);
                    t = Task.of(p);
                    computation = t
                        .map(function (o) { return o.result; })
                        .map(function (r) { return r.port; })
                        .map(function (p) { return p + 1111; });
                    return [4 /*yield*/, computation.fork(mockFn, id)];
                case 1:
                    newPort = _a.sent();
                    expect(mockFn).toBeCalled;
                    expect(newPort).toBe(e);
                    return [2 /*return*/];
            }
        });
    }); });
    it("handles errors on subsequent operations", function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, t, newPort;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    api = function () { return new Promise(function (resolve) {
                        setTimeout(function () {
                            var r = {
                                result: {
                                    port: 8888,
                                }
                            };
                            resolve(r);
                        }, 2000);
                    }); };
                    t = new Task(api);
                    return [4 /*yield*/, t
                            .map(function (o) { return o.doesnotexist.doesnotexist; })
                            .fork(id, id)];
                case 1:
                    newPort = _a.sent();
                    expect(newPort instanceof Error).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=Task.test.js.map