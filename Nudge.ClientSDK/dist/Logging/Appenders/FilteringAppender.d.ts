import { LogAppender, LogEvent, LogLevel } from "../LoggingInterfaces";
export default class FilteringAppender implements LogAppender {
    private readonly minimumLevel;
    private readonly nextAppender;
    constructor(minimumLevel: LogLevel, nextAppender: LogAppender);
    append: (event: LogEvent) => Promise<void>;
}
