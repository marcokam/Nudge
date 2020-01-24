import ApiAppender, { createExceptionFilter, createExceptionRegexFilter } from "./ApiAppender";
import DefaultApiClient from "~/Api/DefaultApiClient";
import { ApiRequest, ApiResponse } from "~/Api/ApiInterfaces";
import { LogEvent, LogLevel } from "../LoggingInterfaces";
import CustomError from "~/Util/CustomError";

const createMockInvoker = () => {
    const requests: ApiRequest[] = [];
    const invoker = (request: ApiRequest): Promise<ApiResponse> => {
        requests.push(request);
        const response: ApiResponse = {
            ok: true,
            url: request.url,
            status: 200,
            text: () => Promise.resolve("{}"),
            json: () => Promise.resolve({}),
            headers: null as any as Headers
        };
        return Promise.resolve(response);
    }
    return {
        requests,
        invoker
    };    
}
const logPrefix = "https://example.com/api/log/";

class TestError extends CustomError { }    
class TestErrorIgnored extends CustomError { }

const testLogError = (err: any, shouldLog: boolean) => {
    const ambient = () => ({
        "hello": "world"
    });
    const filter = createExceptionFilter("TestErrorIgnored");
    const invoker = createMockInvoker();
    const apiClient = new DefaultApiClient(invoker.invoker);
    const apiAppender = new ApiAppender(apiClient, logPrefix, ambient, filter);
    
    const event: LogEvent = {
        level: LogLevel.error,
        args: () => [ err, "arg1", "arg2" ]
    };
    apiAppender.append(event);

    const expectedApiRequests: ApiRequest[] = !shouldLog ? [] : [
        {
            url: `${logPrefix}error`,
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


it("logs error", () => testLogError(new TestError(), true));

it("does not log ignored error", () => testLogError(new TestErrorIgnored(), false));

it("filters errors with exception regex", () => {
    const filter = createExceptionRegexFilter(/foo/i);
    expect(filter(LogLevel.error, { exception: "FOO", message: "bar" })).toEqual(false);
    expect(filter(LogLevel.error, { exception: "BAR", message: "bar" })).toEqual(true);
});

it("filters errors with message regex", () => {
    const filter = createExceptionRegexFilter(/foo/i, /bar/i);
    expect(filter(LogLevel.error, { exception: "FOO", message: "bar" })).toEqual(false);
    expect(filter(LogLevel.error, { exception: "FOO", message: "foo" })).toEqual(true);
});
