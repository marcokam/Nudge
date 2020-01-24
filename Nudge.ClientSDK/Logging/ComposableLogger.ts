import { Logger, LogAppender, LogArgumentResolver, LogLevel, LogEvent } from "./LoggingInterfaces";
import LazyValue from "~/Util/LazyValue";

export default class ComposableLogger implements Logger {
    
    private readonly appender: LogAppender;
    //TODO: Move argumentResolver into an appender. 
    private readonly argumentResolver: LogArgumentResolver;
    
    constructor(appender: LogAppender, argumentResolver: LogArgumentResolver) {
        this.appender = appender;
        this.argumentResolver = argumentResolver;
    }

    logEvent = (event: LogEvent): void => {
        try {
            this.logUnsafe(event).catch(this.logErrorWhileLogging);
        } catch (err) {
            this.logErrorWhileLogging(err);
        }
    }

    error = (...args: any) => this.logWithLevel(LogLevel.error, args);
    warning = (...args: any) => this.logWithLevel(LogLevel.warning, args);
    info = (...args: any) => this.logWithLevel(LogLevel.info, args);
    debug = (...args: any) => this.logWithLevel(LogLevel.debug, args);
    private logWithLevel = (level: LogLevel, args: any[]) => this.logEvent({ level, args: () => args });

    private logUnsafe = (event: LogEvent): Promise<void> => {
        return this.appender.append({
            level: event.level,
            args: new LazyValue(() => this.argumentResolver.resolve(event.args())).getValue
        });
    }

    private logErrorWhileLogging = (err: Error) => {
        try {
            // Since we are calling to external code in order to resolve
            // the true values (ie the message argument), exceptions
            // above may not actually be problems with the logger.
            // Attempt to log this new exception
            this.logUnsafe({ level: LogLevel.error, args: () => ["Error while logging", err] }).catch(() => {});
        } catch (ignored) {
            // noop
        }
    }
}
