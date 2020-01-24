import { Logger, CategorySettings, LogEvent } from "../LoggingInterfaces";
export default class CategoryLogger implements Logger {
    private categorySettings;
    private readonly wrappedLogger;
    constructor(defaultSettings: CategorySettings, wrappedLogger?: () => Logger);
    configure: (settings: CategorySettings) => void;
    logEvent: (event: LogEvent) => void;
    error: (...args: any) => void;
    warning: (...args: any) => void;
    info: (...args: any) => void;
    debug: (...args: any) => void;
    private logWithLevel;
    private logEventInternal;
}
