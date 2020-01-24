import registry from "~/Util/registry";

function logErrorEvent(errorEvent: ErrorEvent) {
    try {
        const {message, error} = errorEvent;
        registry.logger.error(message, error);
    } catch(e) {
        // Don't throw exceptions in logger since it turns into an infinite loop
    }
}

function logPromiseRejectionEvent(promiseRejectionEvent: PromiseRejectionEvent){
    try {
        const {reason} = promiseRejectionEvent;
        const {message} = reason;
        registry.logger.error(message, reason);
    } catch(e) {
        // Don't throw exceptions in logger since it turns into an infinite loop
    }
}

export const setupWindowErrorEvent = () => window.addEventListener("error", logErrorEvent);
export const setupWindowUnhandledRejectionEvent = () => window.addEventListener("unhandledrejection", logPromiseRejectionEvent);
