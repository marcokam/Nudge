import { LogLevel } from "./LoggingInterfaces";
import BufferedLogger from "./BufferedLogger";
import { LogFilter } from "./Appenders/ApiAppender";
export interface LoggingConfig {
    defaultCategoryMinimumLevel: LogLevel;
    showCategories: string[];
    console: {
        minimumLevel: LogLevel;
    };
    api: {
        minimumLevel: LogLevel;
    };
}
export declare const setupStandardLogger2: (loggingConfig: LoggingConfig, bufferedLogger: BufferedLogger, logApiPrefix: string, ambientProperties: () => any, apiLogFilter?: LogFilter | undefined) => void;
export declare const setupStandardLogger: (bufferedLogger: BufferedLogger, securityManagementUrl: string, loggingConfig: LoggingConfig) => void;
