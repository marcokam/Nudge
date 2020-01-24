import ConsoleAppender, { ConsoleLike } from "./ConsoleAppender";
import { LogLevel } from "../LoggingInterfaces";

interface ConsoleEntry {
    level: LogLevel;
    args: any[];
};

class MockConsole implements ConsoleLike {
    readonly events: ConsoleEntry[] = [];
    
    private createFunc = (level: LogLevel) => (...args: any[]) => this.events.push({ level, args });
    error = this.createFunc(LogLevel.error);
    warn = this.createFunc(LogLevel.warning);
    log = this.createFunc(LogLevel.info);
    debug = this.createFunc(LogLevel.debug);
}

const testLevel = (level: LogLevel) => {
    const mConsole = new MockConsole();
    const appender = new ConsoleAppender(mConsole);
    const args = [ 4, "hello", false ];
    appender.append({ level, args: () => args })
    expect(mConsole.events).toEqual([{ level, args }]);
};

it("test error", () => {
    testLevel(LogLevel.error);
});

it("test warning", () => {
    testLevel(LogLevel.warning);
});

it("test info", () => {
    testLevel(LogLevel.info);
});
it("test debug", () => {
    testLevel(LogLevel.debug);
});
