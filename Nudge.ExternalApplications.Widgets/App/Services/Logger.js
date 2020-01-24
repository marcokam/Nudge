/*
 * Tries to log all exceptions and promise errors to the server.
 *
 */

import { promiseTry } from "~/App/Utils/promiseUtils.js";

let accessToken = null;

const logLevels = {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
};
const apiRoutes = {
    exception: "exception",
    error: "error",
    warning: "warning",
};

let config;
// @ifdef DEBUG
config = {
    minimumLevel: logLevels.debug,
    logToConsole: true
};
// @endif
// @ifndef DEBUG
config = {
    minimumLevel: logLevels.warning,
    logToConsole: false
};
// @endif

// eslint-disable-next-line no-console
const consoleRef = console;
const originalConsole = {    
    error: consoleRef.error.bind(consoleRef),
    warn: consoleRef.warn.bind(consoleRef),
    log: consoleRef.log.bind(consoleRef),
};
const ambientProperties = {};
const resolveFunction = f => f && f.constructor && f.call && f.apply ? f() : f;

function setAccessToken(newToken) {
    accessToken = newToken;
}

function resolveString(f) {
    const resolved = resolveFunction(f);
    return typeof resolved === "string" ? resolved : JSON.stringify(resolved);
}

function addMetaDataToBody(body) {

    // Resolve ambientProperties
    const additionalAmbientProperties = {};
    Object.entries(ambientProperties).forEach(([key, value]) => {
        additionalAmbientProperties[key] = resolveFunction(value);
    });

    return {
        version: Nudge.version || "",
        ...body,
        additionalProperties: {
            ...additionalAmbientProperties,
            ...body.additionalProperties,
        }
    };
}

function sendToApi(apiRoute, body) {
    if (!apiRoute || body === null) {
        return;
    }

    const url = `${Nudge.urls.securityManagement}/api/v1/log/${apiRoute}`;
    // We provide access token ourselves just in case there is a
    // problem with it we do not want a loop between the
    // api -> auth -> logger -> api -> (etc)
    const options = { 
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Correlation-Type": "mobileui",
            "mode": "cors"
        },
        body: JSON.stringify(addMetaDataToBody(body))
    };
    return fetch(url, options).catch(()=>{
        // Don't throw exceptions in logger since it turns into an infinite loop
    });
}

function runSafe(fn) {
    return promiseTry(fn)
        // Since we are calling to external code in order to resolve
        // the true values (ie the message argument), exceptions
        // above may not actually be problems with the logger.
        // Attempt to log this new exception
        .catch(err => logUnsafe(logLevels.error, ["Error while logging", err], originalConsole.error, apiRoutes.exception))
        .catch(_ => undefined);    
}

function logUnsafe(level, args, consoleFunc, apiRoute) {
    if (level > config.minimumLevel) {
        return;
    }

    const resolvedArgs = args == null
        ? []
        : args.map(resolveFunction);



    // Get Error objects
    const firstErrArgIndex = resolvedArgs.findIndex(_ => _ instanceof Error);
    const firstErrArg = firstErrArgIndex === -1 ? null : resolvedArgs[firstErrArgIndex];
    const otherArgs = firstErrArg === null ? resolvedArgs : resolvedArgs.filter((_, index) => index !== firstErrArgIndex);

    const message = otherArgs.map(_ => resolveString(_)).join(" ");    
    if (firstErrArg !== null) {
        const ex = resolveException(firstErrArg);
        const body = {
            ...ex,
            message: message,
        };
        return logEventUnsafe(level, resolvedArgs, consoleFunc, apiRoute, body);
    }

    return logEventUnsafe(level, resolvedArgs, consoleFunc, apiRoute, { message });
}

function logEventUnsafe(level, args, consoleFunc, apiRoute, event) {
    // Optionally log to console
    if (config.logToConsole) {
        consoleFunc(...args);
    }
    return sendToApi(apiRoute, event);
}

function logSafe(...args) {
    runSafe(() => logUnsafe(...args));
}

/**
 * Determine the type of an object - useful for determing error type
 * @param  {object} obj  JavaScript object
 * @return {string}     Return type name of object
 */
function typeName(obj) {
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
}

function resolveException(err) {
    if (!err) return {};
    err = resolveFunction(err);
    if (!err) return {};
    const message = err.message || resolveString(err);
    const exception = typeName(err);
    const additionalProperties = {
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

function logErrorEvent(errorEvent){
    try {
        const {message, filename, lineno, colno, error} = errorEvent;
        const source = `${filename} line: ${lineno} column: ${colno}`;
        const stack = error ? error.stack : "";

        const nudgeLoggerEvent = {
            message,
            source: source,
            exception: typeName(error),
            exceptionDetails: stack,            
        };

        logEventUnsafe(logLevels.error, [message, error], originalConsole.error, apiRoutes.exception, nudgeLoggerEvent);
    } catch(e) {
        // Don't throw exceptions in logger since it turns into an infinite loop
    }
}

function logPromiseRejectionEvent(promiseRejectionEvent){
    try {
        const {reason} = promiseRejectionEvent;
        const {message, name, stack} = reason;

        const nudgeLoggerEvent = {
            reason: message,
            exception: name,
            exceptionDetails: stack,
        };
        logEventUnsafe(logLevels.error, [message], originalConsole.error, apiRoutes.exception, nudgeLoggerEvent);
    } catch(e) {
        // Don't throw exceptions in logger since it turns into an infinite loop
    }
}

/**
 * Event handlers
 * 
 */
window.addEventListener("error", (event)=>logErrorEvent(event));
window.addEventListener("unhandledrejection", (event)=>logPromiseRejectionEvent(event));
// window.addEventListener("rejectionhandled", logPromiseRejectionEvent);

/**
 * External Logger API
 */
export default {
    error: (...args) => logSafe(logLevels.error, args, originalConsole.error, apiRoutes.error),
    warning: (...args) => logSafe(logLevels.warning, args, originalConsole.warn, apiRoutes.warning),
    info: (...args) => logSafe(logLevels.info, args, originalConsole.log),
    debug: (...args) => logSafe(logLevels.debug, args, originalConsole.log),
    config,    
    ambientProperties,
    setAccessToken
};
