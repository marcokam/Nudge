import { LogAppender, LogEvent } from "../LoggingInterfaces";
export default class MultiAppender implements LogAppender {
    private readonly otherAppenders;
    constructor(otherAppenders: LogAppender[]);
    append: (event: LogEvent) => Promise<void>;
}
