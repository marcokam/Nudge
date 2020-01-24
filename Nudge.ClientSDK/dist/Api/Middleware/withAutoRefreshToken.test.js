var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import NonRefreshingTokenManager from "../../Authentication/NonRefreshingTokenManager";
import withAutoRefreshToken from "./withAutoRefreshToken";
import NullLogger from "../../Logging/NullLogger";
var logger = new NullLogger();
// Token Managers
var SimpleTokenManager = /** @class */ (function () {
    function SimpleTokenManager() {
        var _this = this;
        this.accessToken = 1;
        this.getAccessToken = function () { return _this.accessToken.toString(); };
        this.supportsRefresh = true;
        this.refreshAccessToken = function () { return Promise.resolve({
            success: true,
            accessToken: (++_this.accessToken).toString()
        }); };
        this.setAccessToken = function (accessToken) { return _this.accessToken = accessToken; };
    }
    return SimpleTokenManager;
}());
var nonRefreshingTokenManager = new NonRefreshingTokenManager(function () { return "accessToken1"; });
// Requests
var apiUrl = "https://api.nudge.ai/v2/fake";
var simpleRequest = {
    url: apiUrl,
    method: "GET"
};
// Responses
var accessDeniedResponseBody = [{ code: 401001 }];
var accessDeniedResponse = {
    ok: false,
    url: apiUrl,
    status: 401,
    text: function () { return Promise.resolve(JSON.stringify(accessDeniedResponseBody)); },
    json: function () { return Promise.resolve(accessDeniedResponseBody); },
    headers: null,
    getText: function () { return Promise.resolve(JSON.stringify(accessDeniedResponseBody)); },
    getJson: function () { return Promise.resolve(accessDeniedResponseBody); },
};
var successResponseBody = {};
var successResponse = {
    ok: true,
    url: apiUrl,
    status: 200,
    text: function () { return Promise.resolve(JSON.stringify(successResponseBody)); },
    json: function () { return Promise.resolve(successResponseBody); },
    headers: null,
    getText: function () { return Promise.resolve(JSON.stringify(successResponseBody)); },
    getJson: function () { return Promise.resolve(successResponseBody); },
};
// Invokers
var createInvoker = function () {
    var validTokens = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        validTokens[_i] = arguments[_i];
    }
    return function (request) {
        return request.accessToken && validTokens.find(function (_) { return _ === request.accessToken; })
            ? Promise.resolve(successResponse)
            : Promise.resolve(accessDeniedResponse);
    };
};
// Tests
it("doesn't attempt refresh from NonRefreshingTokenManager", function () { return __awaiter(void 0, void 0, void 0, function () {
    var middleWare, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                middleWare = withAutoRefreshToken(nonRefreshingTokenManager, logger);
                return [4 /*yield*/, middleWare(simpleRequest, createInvoker())];
            case 1:
                response = _a.sent();
                expect(response).toBe(accessDeniedResponse);
                return [2 /*return*/];
        }
    });
}); });
it("doesn't attempt refresh when access token supplied in request", function () { return __awaiter(void 0, void 0, void 0, function () {
    var middleWare, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                middleWare = withAutoRefreshToken(new SimpleTokenManager(), logger);
                return [4 /*yield*/, middleWare(__assign(__assign({}, simpleRequest), { accessToken: "1" }), createInvoker("2"))];
            case 1:
                response = _a.sent();
                expect(response).toBe(accessDeniedResponse);
                return [2 /*return*/];
        }
    });
}); });
it("refreshes and retries", function () { return __awaiter(void 0, void 0, void 0, function () {
    var middleWare, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                middleWare = withAutoRefreshToken(new SimpleTokenManager(), logger);
                return [4 /*yield*/, middleWare(simpleRequest, createInvoker("2"))];
            case 1:
                response = _a.sent();
                expect(response).toBe(successResponse);
                return [2 /*return*/];
        }
    });
}); });
it("uses new token when token changes during in-flight request", function () { return __awaiter(void 0, void 0, void 0, function () {
    var validToken, accessToken, tokenManager, middleWare, invoker, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validToken = "valid";
                accessToken = "invalid";
                tokenManager = {
                    getAccessToken: function () { return accessToken; },
                    supportsRefresh: true,
                    refreshAccessToken: function () { throw Error("shouldn't do this"); }
                };
                middleWare = withAutoRefreshToken(tokenManager, logger);
                invoker = function (request) {
                    accessToken = validToken;
                    var response = request.accessToken === validToken
                        ? successResponse
                        : accessDeniedResponse;
                    return Promise.resolve(response);
                };
                return [4 /*yield*/, middleWare(simpleRequest, invoker)];
            case 1:
                response = _a.sent();
                expect(response).toBe(successResponse);
                return [2 /*return*/];
        }
    });
}); });
it("returns original response when refresh throws", function () { return __awaiter(void 0, void 0, void 0, function () {
    var tokenManager, middleWare, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenManager = {
                    getAccessToken: function () { return "invalid"; },
                    supportsRefresh: true,
                    refreshAccessToken: function () { return Promise.reject("Refresh failed"); }
                };
                middleWare = withAutoRefreshToken(tokenManager, logger);
                return [4 /*yield*/, middleWare(simpleRequest, createInvoker())];
            case 1:
                response = _a.sent();
                expect(response).toBe(accessDeniedResponse);
                return [2 /*return*/];
        }
    });
}); });
it("returns original response when refresh returns false", function () { return __awaiter(void 0, void 0, void 0, function () {
    var tokenManager, middleWare, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenManager = {
                    getAccessToken: function () { return "invalid"; },
                    supportsRefresh: true,
                    refreshAccessToken: function () { return Promise.resolve({ success: false, accessToken: "valid" }); }
                };
                middleWare = withAutoRefreshToken(tokenManager, logger);
                return [4 /*yield*/, middleWare(simpleRequest, createInvoker("valid"))];
            case 1:
                response = _a.sent();
                expect(response).toBe(accessDeniedResponse);
                return [2 /*return*/];
        }
    });
}); });
it("returns original response when second request fails", function () { return __awaiter(void 0, void 0, void 0, function () {
    var middleWare, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                middleWare = withAutoRefreshToken(new SimpleTokenManager(), logger);
                return [4 /*yield*/, middleWare(simpleRequest, createInvoker())];
            case 1:
                response = _a.sent();
                //TODO: This doesn't actually differentiate between 1st and 2nd requests
                expect(response).toBe(accessDeniedResponse);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=withAutoRefreshToken.test.js.map