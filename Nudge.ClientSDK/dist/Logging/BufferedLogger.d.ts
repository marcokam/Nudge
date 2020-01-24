import { Logger, LogEvent } from "./LoggingInterfaces";
export default class BufferedLogger implements Logger {
    private queue;
    private wrapped;
    setLogger(wrapped: Logger): void;
    logEvent: (event: LogEvent) => void;
    error: (...args: any) => void;
    warning: (...args: any) => void;
    info: (...args: any) => void;
    debug: (...args: any) => void;
    private enqueueWithLevel;
    private sendDirect;
}
