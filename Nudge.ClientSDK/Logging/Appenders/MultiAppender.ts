import { LogAppender, LogEvent } from "../LoggingInterfaces";
import { mapAndJoinErrors } from "~/Util/PromiseUtils";

export default class MultiAppender implements LogAppender {
    
    private readonly otherAppenders: LogAppender[];

    constructor(otherAppenders: LogAppender[]) {
        this.otherAppenders = otherAppenders;
    }
    
    append = (event: LogEvent): Promise<void> => {
        return mapAndJoinErrors(this.otherAppenders, (appender: LogAppender) => appender.append(event))
            .then(); // Back to Promise<void> from Promise<void[]>
    }

}