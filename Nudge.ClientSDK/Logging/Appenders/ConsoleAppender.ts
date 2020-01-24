import { LogAppender, LogEvent, LogLevel } from "../LoggingInterfaces";
import { voidPromise } from "~/Util/PromiseUtils";

export interface ConsoleLike {
    error: ConsoleFunc;
    warn: ConsoleFunc;
    log: ConsoleFunc;
    debug: ConsoleFunc;
}
type ConsoleFunc = (message?: any, ...optionalParams: any[]) => void;

export default class ConsoleAppender implements LogAppender {
    
    private readonly consoleLike: ConsoleLike;

    /* eslint no-console: 0 */
    constructor(consoleLike: ConsoleLike = console) {
        // Bind this onto console object
        this.consoleLike = {
            error: consoleLike.error.bind(consoleLike),
            warn: consoleLike.warn.bind(consoleLike),
            log: consoleLike.log.bind(consoleLike),
            debug: consoleLike.debug.bind(consoleLike),
        };
    }

    append = (event: LogEvent): Promise<void> => {
        const args = event.args();
        const func = this.getFunc(event.level);
        if (!func) {
            throw Error("Unknown event level");            
        }
        func(...args);
        return voidPromise;
    }

    private getFunc = (logLevel: LogLevel) => {
        switch (logLevel) {
            case LogLevel.error: return this.consoleLike.error;
            case LogLevel.warning: return this.consoleLike.warn;
            case LogLevel.info: return this.consoleLike.log;
            case LogLevel.debug: return this.consoleLike.debug;
            default: return null;
        }
    }

}