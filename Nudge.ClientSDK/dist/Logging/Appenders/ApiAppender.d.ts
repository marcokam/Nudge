import { LogAppender, LogEvent, LogLevel } from "../LoggingInterfaces";
import ApiClient from "../../Api/ApiInterfaces";
interface ExceptionProperties {
    message?: string;
    exception?: string;
    exceptionDetails?: string;
    additionalProperties?: any;
}
declare type AmbientPropertiesFunc = () => any | undefined;
export declare const createExceptionFilter: (exception: string, message?: string | undefined) => (_: LogLevel, body: ExceptionProperties) => boolean;
export declare const createExceptionRegexFilter: (exceptionRegExp: RegExp, messageRegExp?: RegExp | undefined) => (_: LogLevel, body: ExceptionProperties) => boolean;
export declare const joinLogFilters: (...filters: LogFilter[]) => LogFilter;
export declare const abortFilter: (_: LogLevel, body: ExceptionProperties) => boolean;
export declare type LogFilter = (level: LogLevel, body: ExceptionProperties) => boolean;
export default class ApiAppender implements LogAppender {
    private readonly apiClient;
    private readonly logApiPrefix;
    private readonly ambientProperties?;
    private readonly logFilter;
    constructor(apiClient: ApiClient, logApiPrefix: string, ambientProperties?: AmbientPropertiesFunc, logFilter?: LogFilter);
    append(event: LogEvent): Promise<void>;
    private sendToApi;
}
export {};
