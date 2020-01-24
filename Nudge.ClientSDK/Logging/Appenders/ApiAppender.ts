import { LogAppender, LogEvent, LogLevel } from "../LoggingInterfaces";
import { resolveString, resolveFunction } from "~/Util/utils";
import ApiClient from "~/Api/ApiInterfaces";
import { voidPromise } from "~/Util/PromiseUtils";

const promiseEmpty = Promise.resolve(null);
const apiRoutes = {
    [LogLevel.error]: "error",
    [LogLevel.warning]: "warning",
    [LogLevel.info]: undefined,
    [LogLevel.debug]: undefined
};

function errorTypeName(obj: any): string {

    try {
        return Object.getPrototypeOf(obj).constructor.name;
    } catch (e1) {
        // noop
    }
    try {
        return Object.getPrototypeOf(obj).name;
    } catch (e2) {
        // noop
    }
    try {
        return Object.prototype.toString.call(obj).slice(8, -1);
    } catch (e3) {
        // noop
    }

    return "";
}

interface ExceptionProperties {
    message?: string;
    exception?: string;
    exceptionDetails?: string;
    additionalProperties?: any;
};
function resolveExceptionProperties(err: Error): ExceptionProperties {
    if (!err) return {};
    err = resolveFunction(err);
    if (!err) return {};
    const message: string = err.message || resolveString(err);
    const exception: string = errorTypeName(err);
    const additionalProperties: any = {
        ...err,
    };
    additionalProperties.stack = undefined;
    additionalProperties.message = undefined;

    return {
        message,
        exception,
        exceptionDetails: err.stack,
        additionalProperties,
    };
}
function addMetaDataToBody(body: any, ambientProperties?: any): any {

    // Resolve ambientProperties
    const additionalAmbientProperties: any = {};
    if (ambientProperties) {
        Object.entries(ambientProperties).forEach(([key, value]) => {
            additionalAmbientProperties[key] = resolveFunction(value);
        });
    }

    return {
        ...body,
        additionalProperties: {
            ...additionalAmbientProperties,
            ...body.additionalProperties,
        }
    };
}

type AmbientPropertiesFunc = () => any | undefined;

//TODO: Deprecate this once we are confident in the implementation of createExceptionRegexFilter.
export const createExceptionFilter = (exception: string, message?: string) => (_: LogLevel, body: ExceptionProperties) =>
    !(body && body.exception == exception && (!message || body.message == message));

export const createExceptionRegexFilter = (exceptionRegExp: RegExp, messageRegExp?: RegExp) => (_: LogLevel, body: ExceptionProperties) => {
    // Exception doesn't match
    if (!body || !body.exception || !body.exception.match(exceptionRegExp)) {
        return true;
    }

    // Exception matches and we don't have a Message filter
    if (!messageRegExp) {
        return false;
    }

    // Message doesn't match    
    if (!body || !body.message || !body.message.match(messageRegExp)) {
        return true;
    }

    // Both match
    return false;
};

export const joinLogFilters = (...filters: LogFilter[]): LogFilter => (level: LogLevel, body: ExceptionProperties) => 
    !filters.find(f => !f(level, body));
export const abortFilter = createExceptionFilter("DOMException", "The user aborted a request.");

// Result of false signals to NOT log this exception
export type LogFilter = (level: LogLevel, body: ExceptionProperties) => boolean;

export default class ApiAppender implements LogAppender {

    private readonly apiClient: ApiClient;
    private readonly logApiPrefix: string;
    private readonly ambientProperties?: AmbientPropertiesFunc;
    private readonly logFilter: LogFilter;

    constructor(apiClient: ApiClient, logApiPrefix: string, ambientProperties?: AmbientPropertiesFunc, logFilter?: LogFilter) {
        this.apiClient = apiClient;
        this.logApiPrefix = logApiPrefix;
        this.ambientProperties = ambientProperties;
        this.logFilter = logFilter || (() => true);
    }

    append(event: LogEvent): Promise<void> {
        const apiRoute: string | undefined = apiRoutes[event.level];
        if (!apiRoute) {
            return voidPromise;
        }

        const args = event.args();

        // Get Error objects
        const firstErrArgIndex = args.findIndex(_ => _ instanceof Error);
        const firstErrArg = firstErrArgIndex === -1 ? null : args[firstErrArgIndex];
        const otherArgs = firstErrArg === null ? args : args.filter((_, index) => index !== firstErrArgIndex);

        const message = otherArgs.map(_ => resolveString(_)).join(" ");

        if (!firstErrArg) {
            return this.sendToApi(event.level, apiRoute, { message });
        }
        const ex = resolveExceptionProperties(firstErrArg as Error);
        const body: ExceptionProperties = {
            ...ex,
            message: message,
        };
        return this.sendToApi(event.level, apiRoute, body);
    }

    private sendToApi(logLevel: LogLevel, apiRoute: string | undefined, body: ExceptionProperties): Promise<any> {
        if (!apiRoute || body === null || !this.logFilter(logLevel, body)) {
            return promiseEmpty;
        }
        const url = `${this.logApiPrefix}${apiRoute}`;
        const ambientProperties = this.ambientProperties && this.ambientProperties();
        const actualBody = addMetaDataToBody(body, ambientProperties);
        return this.apiClient.postJson(url, actualBody);
    }
}