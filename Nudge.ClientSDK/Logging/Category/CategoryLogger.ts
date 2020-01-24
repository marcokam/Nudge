import registry from "~/Util/registry";
import { Logger, CategorySettings, LogEvent, LogLevel } from "../LoggingInterfaces";

export default class CategoryLogger implements Logger {

    private categorySettings: CategorySettings; 
    private readonly wrappedLogger: () => Logger;
    
    constructor(defaultSettings: CategorySettings, wrappedLogger?: () => Logger) {
        this.categorySettings = defaultSettings;
        this.wrappedLogger = wrappedLogger || (() => registry.logger);
    }

    configure = (settings: CategorySettings) => {
        this.categorySettings = settings;
    }

    logEvent = (event: LogEvent): void => {
        if (event.level > this.categorySettings.minLevel) {
            return;
        }
        this.logEventInternal(event);
    }

    error = (...args: any) => this.logWithLevel(LogLevel.error, args);
    warning = (...args: any) => this.logWithLevel(LogLevel.warning, args);
    info = (...args: any) => this.logWithLevel(LogLevel.info, args);
    debug = (...args: any) => this.logWithLevel(LogLevel.debug, args);
    private logWithLevel = (level: LogLevel, args: any[]) => {
        if (level > this.categorySettings.minLevel) {
            return;
        }
        this.logEventInternal({ level, args: () => args });
    };

    private logEventInternal(event: LogEvent) {
        this.wrappedLogger().logEvent(event);
    }
}