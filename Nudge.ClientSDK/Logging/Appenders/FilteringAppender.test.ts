import FilteringAppender from "./FilteringAppender";
import { LogLevel, LogEvent, LogAppender } from "../LoggingInterfaces";
import uuid from "uuid";
import { voidPromise } from "~/Util/PromiseUtils";

class MockAppender implements LogAppender {
    readonly events: LogEvent[] = [];
    append = (event: LogEvent) => { this.events.push(event); return voidPromise; }
}

const test = (minLevel: LogLevel, loggedLevels: LogLevel[], skippedLevels: LogLevel[]) => {
    const mockAppender = new MockAppender();
    const filteringAppender = new FilteringAppender(minLevel, mockAppender);

    const shouldHave: LogEvent[] = [];    
    loggedLevels.forEach(level => {
        const args = [ 1, "hello", false, {}, uuid() ];
        const event = { level: level, args: () => args};
        filteringAppender.append(event);
        shouldHave.push(event);
    });

    skippedLevels.forEach(level => {
        const event = { level: level, args: () => { throw Error("This should not happen"); }};
        filteringAppender.append(event);
    })
    expect(mockAppender.events).toEqual(shouldHave);    
}

it("minLevel error", () => {
    test(LogLevel.error, [LogLevel.error], [LogLevel.warning, LogLevel.info, LogLevel.debug]);    
});
it("minLevel warning", () => {
    test(LogLevel.warning, [LogLevel.error, LogLevel.warning], [LogLevel.info, LogLevel.debug]);    
});
it("minLevel info", () => {
    test(LogLevel.info, [LogLevel.error, LogLevel.warning, LogLevel.info], [LogLevel.debug]);    
});
it("minLevel debug", () => {
    test(LogLevel.debug, [LogLevel.error, LogLevel.warning, LogLevel.info, LogLevel.debug], []);    
});