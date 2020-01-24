import { LogAppender, LogEvent } from "../LoggingInterfaces";
export interface ConsoleLike {
    error: ConsoleFunc;
    warn: ConsoleFunc;
    log: ConsoleFunc;
    debug: ConsoleFunc;
}
declare type ConsoleFunc = (message?: any, ...optionalParams: any[]) => void;
export default class ConsoleAppender implements LogAppender {
    private readonly consoleLike;
    constructor(consoleLike?: ConsoleLike);
    append: (event: LogEvent) => Promise<void>;
    private getFunc;
}
export {};
