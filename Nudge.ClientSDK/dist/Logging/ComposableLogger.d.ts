import { Logger, LogAppender, LogArgumentResolver, LogEvent } from "./LoggingInterfaces";
export default class ComposableLogger implements Logger {
    private readonly appender;
    private readonly argumentResolver;
    constructor(appender: LogAppender, argumentResolver: LogArgumentResolver);
    logEvent: (event: LogEvent) => void;
    error: (...args: any) => void;
    warning: (...args: any) => void;
    info: (...args: any) => void;
    debug: (...args: any) => void;
    private logWithLevel;
    private logUnsafe;
    private logErrorWhileLogging;
}
