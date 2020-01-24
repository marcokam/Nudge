import { LogAppender, LogEvent, LogLevel } from "../LoggingInterfaces";
import { voidPromise } from "~/Util/PromiseUtils";

export default class FilteringAppender implements LogAppender {

    private readonly minimumLevel: LogLevel;
    private readonly nextAppender: LogAppender;

    constructor(minimumLevel: LogLevel, nextAppender: LogAppender) {
        this.minimumLevel = minimumLevel;
        this.nextAppender = nextAppender;
    }

    append = (event: LogEvent): Promise<void> => {
        if (event.level > this.minimumLevel) {
            return voidPromise;
        }
        return this.nextAppender.append(event);
    }

}