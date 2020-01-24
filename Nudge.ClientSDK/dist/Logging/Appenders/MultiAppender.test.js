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
import { LogLevel } from "../LoggingInterfaces";
import MultiAppender from "./MultiAppender";
import { voidPromise, emptyPromise } from "../../Util/PromiseUtils";
import HttpError from "../../Api/Errors/HttpError";
import AggregateError from "../../Util/AggregateError";
var MockAppender = /** @class */ (function () {
    function MockAppender() {
        var _this = this;
        this.events = [];
        this.append = function (event) { _this.events.push(event); return voidPromise; };
    }
    return MockAppender;
}());
var ThrowingAppender = /** @class */ (function () {
    function ThrowingAppender(err, sync) {
        var _this = this;
        this.append = function () {
            if (_this.sync) {
                throw _this.err;
            }
            return Promise.reject(_this.err);
        };
        this.err = err;
        this.sync = sync;
    }
    return ThrowingAppender;
}());
var sampleErrorResponse = {
    ok: false,
    url: "https://example.com/api/log/error",
    status: 500,
    text: function () { return emptyPromise; },
    json: function () { return emptyPromise; },
    headers: null
};
var sampleError = new HttpError(sampleErrorResponse);
it("logs to both appenders", function () {
    var mock1 = new MockAppender();
    var mock2 = new MockAppender();
    var multi = new MultiAppender([mock1, mock2]);
    var events = [
        { level: LogLevel.error, args: function () { return [1]; } },
        { level: LogLevel.error, args: function () { return [2]; } }
    ];
    events.forEach(multi.append);
    expect(mock1.events).toEqual(events);
    expect(mock2.events).toEqual(events);
});
it("throws sync error in single appender", function () { return __awaiter(void 0, void 0, void 0, function () {
    var mock1, mock2, multi, event;
    return __generator(this, function (_a) {
        mock1 = new MockAppender();
        mock2 = new ThrowingAppender(sampleError, true);
        multi = new MultiAppender([mock1, mock2]);
        event = { level: LogLevel.error, args: function () { return [1]; } };
        expect(multi.append(event)).rejects.toEqual(sampleError);
        return [2 /*return*/];
    });
}); });
it("throws async error in single appender", function () { return __awaiter(void 0, void 0, void 0, function () {
    var mock1, mock2, multi, event;
    return __generator(this, function (_a) {
        mock1 = new MockAppender();
        mock2 = new ThrowingAppender(sampleError, false);
        multi = new MultiAppender([mock1, mock2]);
        event = { level: LogLevel.error, args: function () { return [1]; } };
        expect(multi.append(event)).rejects.toEqual(sampleError);
        return [2 /*return*/];
    });
}); });
it("throws mixed errors in multiple appenders", function () { return __awaiter(void 0, void 0, void 0, function () {
    var mock1, mock2, multi, event, expectedError;
    return __generator(this, function (_a) {
        mock1 = new ThrowingAppender(sampleError, true);
        mock2 = new ThrowingAppender(sampleError, false);
        multi = new MultiAppender([mock1, mock2]);
        event = { level: LogLevel.error, args: function () { return [1]; } };
        expectedError = new AggregateError([sampleError, sampleError]);
        expect(multi.append(event)).rejects.toEqual(expectedError);
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=MultiAppender.test.js.map