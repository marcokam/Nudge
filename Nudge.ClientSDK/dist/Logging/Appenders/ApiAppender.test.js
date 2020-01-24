var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import ApiAppender, { createExceptionFilter, createExceptionRegexFilter } from "./ApiAppender";
import DefaultApiClient from "../../Api/DefaultApiClient";
import { LogLevel } from "../LoggingInterfaces";
import CustomError from "../../Util/CustomError";
var createMockInvoker = function () {
    var requests = [];
    var invoker = function (request) {
        requests.push(request);
        var response = {
            ok: true,
            url: request.url,
            status: 200,
            text: function () { return Promise.resolve("{}"); },
            json: function () { return Promise.resolve({}); },
            headers: null
        };
        return Promise.resolve(response);
    };
    return {
        requests: requests,
        invoker: invoker
    };
};
var logPrefix = "https://example.com/api/log/";
var TestError = /** @class */ (function (_super) {
    __extends(TestError, _super);
    function TestError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TestError;
}(CustomError));
var TestErrorIgnored = /** @class */ (function (_super) {
    __extends(TestErrorIgnored, _super);
    function TestErrorIgnored() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TestErrorIgnored;
}(CustomError));
var testLogError = function (err, shouldLog) {
    var ambient = function () { return ({
        "hello": "world"
    }); };
    var filter = createExceptionFilter("TestErrorIgnored");
    var invoker = createMockInvoker();
    var apiClient = new DefaultApiClient(invoker.invoker);
    var apiAppender = new ApiAppender(apiClient, logPrefix, ambient, filter);
    var event = {
        level: LogLevel.error,
        args: function () { return [err, "arg1", "arg2"]; }
    };
    apiAppender.append(event);
    var expectedApiRequests = !shouldLog ? [] : [
        {
            url: logPrefix + "error",
            method: "POST",
            body: JSON.stringify({
                message: "arg1 arg2",
                exception: Object.getPrototypeOf(err).constructor.name,
                exceptionDetails: err.stack,
                additionalProperties: ambient()
            })
        }
    ];
    expect(invoker.requests).toEqual(expectedApiRequests);
};
it("logs error", function () { return testLogError(new TestError(), true); });
it("does not log ignored error", function () { return testLogError(new TestErrorIgnored(), false); });
it("filters errors with exception regex", function () {
    var filter = createExceptionRegexFilter(/foo/i);
    expect(filter(LogLevel.error, { exception: "FOO", message: "bar" })).toEqual(false);
    expect(filter(LogLevel.error, { exception: "BAR", message: "bar" })).toEqual(true);
});
it("filters errors with message regex", function () {
    var filter = createExceptionRegexFilter(/foo/i, /bar/i);
    expect(filter(LogLevel.error, { exception: "FOO", message: "bar" })).toEqual(false);
    expect(filter(LogLevel.error, { exception: "FOO", message: "foo" })).toEqual(true);
});
//# sourceMappingURL=ApiAppender.test.js.map