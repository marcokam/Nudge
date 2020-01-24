import { LogAppender, LogEvent, LogLevel } from "../LoggingInterfaces";
import MultiAppender from "./MultiAppender";
import { voidPromise, emptyPromise } from "~/Util/PromiseUtils";
import HttpError from "~/Api/Errors/HttpError";
import AggregateError from "~/Util/AggregateError";
import { ApiResponse } from "~/Api/ApiInterfaces";

class MockAppender implements LogAppender {
    readonly events: LogEvent[] = [];
    append = (event: LogEvent) => { this.events.push(event); return voidPromise; }
}
class ThrowingAppender implements LogAppender {
    private readonly err: Error;
    private readonly sync: boolean
    constructor(err: Error, sync: boolean) {
        this.err = err;
        this.sync = sync;
    }
    append = () => {
        if (this.sync) {
            throw this.err;
        }
        return Promise.reject(this.err);
    };
}
const sampleErrorResponse: ApiResponse = {
    ok: false,    
    url: "https://example.com/api/log/error",
    status: 500,
    text: () => emptyPromise,
    json: () => emptyPromise,
    headers: null as any as Headers
};
const sampleError = new HttpError(sampleErrorResponse);

it("logs to both appenders", () => {
    const mock1 = new MockAppender();
    const mock2 = new MockAppender();
    const multi = new MultiAppender([mock1, mock2]);
    const events: LogEvent[] = [
        { level: LogLevel.error, args: () => [1] },
        { level: LogLevel.error, args: () => [2] }
    ];
    events.forEach(multi.append);
    expect(mock1.events).toEqual(events);
    expect(mock2.events).toEqual(events);
});

it ("throws sync error in single appender", async () => {
    const mock1 = new MockAppender();
    const mock2 = new ThrowingAppender(sampleError, true);
    const multi = new MultiAppender([mock1, mock2]);
    const event = { level: LogLevel.error, args: () => [1] };
    expect(multi.append(event)).rejects.toEqual(sampleError);
})

it ("throws async error in single appender", async () => {
    const mock1 = new MockAppender();
    const mock2 = new ThrowingAppender(sampleError, false);
    const multi = new MultiAppender([mock1, mock2]);
    const event = { level: LogLevel.error, args: () => [1] };
    expect(multi.append(event)).rejects.toEqual(sampleError);
})

it ("throws mixed errors in multiple appenders", async () => {
    const mock1 = new ThrowingAppender(sampleError, true);
    const mock2 = new ThrowingAppender(sampleError, false);
    const multi = new MultiAppender([mock1, mock2]);
    const event = { level: LogLevel.error, args: () => [1] };
    const expectedError = new AggregateError([sampleError, sampleError])
    expect(multi.append(event)).rejects.toEqual(expectedError);
})