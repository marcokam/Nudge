import { Logger, LogLevel, LogEvent } from "./LoggingInterfaces";

export default class BufferedLogger implements Logger {
    
    private queue: LogEvent[] = [];
    private wrapped: Logger | null = null;

    setLogger(wrapped: Logger) {
        if (this.wrapped) {
            throw new Error("Attempt to setLogger when logger already set.");
        }
        this.wrapped = wrapped;

        // Flush queue
        let current: LogEvent | undefined = undefined;
        while (current = this.queue.shift()) {
            this.sendDirect(this.wrapped, current);
        }
    }

    logEvent = (event: LogEvent): void => {
        if (this.wrapped) {
            this.sendDirect(this.wrapped, event);
        } else {
            this.queue.push(event);
        }
    }

    error = (...args: any): void => this.enqueueWithLevel(LogLevel.error, args);
    warning = (...args: any): void => this.enqueueWithLevel(LogLevel.warning, args);
    info = (...args: any): void => this.enqueueWithLevel(LogLevel.info, args);
    debug = (...args: any): void => this.enqueueWithLevel(LogLevel.debug, args);

    private enqueueWithLevel = (level: LogLevel, args: any[]): void => {        
        this.logEvent({ level, args: () => args });
    }

    private sendDirect = (wrapped: Logger, event: LogEvent): void => {
        wrapped.logEvent(event);
    }
}
