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
import disableSaveMiddleware, { createMockResponse } from "./disableSave";
var createRequest = function (method) { return ({
    url: "https://example.com/api/test",
    method: method
}); };
var expectResponsesEqual = function (r1, r2) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                expect(r1).toBeTruthy();
                expect(r2).toBeTruthy();
                expect(r1.url).toEqual(r2.url);
                expect(r1.status).toEqual(r2.status);
                _b = expect;
                return [4 /*yield*/, r1.text()];
            case 1:
                _c = (_a = _b.apply(void 0, [_g.sent()])).toEqual;
                return [4 /*yield*/, r2.text()];
            case 2:
                _c.apply(_a, [_g.sent()]);
                _e = expect;
                return [4 /*yield*/, r1.json()];
            case 3:
                _f = (_d = _e.apply(void 0, [_g.sent()])).toEqual;
                return [4 /*yield*/, r2.json()];
            case 4:
                _f.apply(_d, [_g.sent()]);
                expect(r1.headers).toEqual(r2.headers);
                return [2 /*return*/];
        }
    });
}); };
var createResponse = function (request) { return ({
    ok: true,
    url: request.url,
    status: 777,
    text: function () { return Promise.resolve("5"); },
    json: function () { return Promise.resolve(5); },
    headers: new Headers({})
}); };
it("disables POST", function () { return __awaiter(void 0, void 0, void 0, function () {
    var middleware, request, response, expectedResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                middleware = disableSaveMiddleware(true);
                request = createRequest("POST");
                return [4 /*yield*/, middleware(request, function () { throw Error("Should not happen!"); })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, createMockResponse(request)];
            case 2:
                expectedResponse = _a.sent();
                return [4 /*yield*/, expectResponsesEqual(response, expectedResponse)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it("does not disable GET", function () { return __awaiter(void 0, void 0, void 0, function () {
    var middleware, request, expectedResponse, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                middleware = disableSaveMiddleware(true);
                request = createRequest("GET");
                expectedResponse = createResponse(request);
                return [4 /*yield*/, middleware(request, function () { return Promise.resolve(expectedResponse); })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, expectResponsesEqual(response, expectedResponse)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
it("does not disable POST when off", function () { return __awaiter(void 0, void 0, void 0, function () {
    var middleware, request, expectedResponse, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                middleware = disableSaveMiddleware(false);
                request = createRequest("POST");
                expectedResponse = createResponse(request);
                return [4 /*yield*/, middleware(request, function () { return Promise.resolve(expectedResponse); })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, expectResponsesEqual(response, expectedResponse)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=disableSave.test.js.map