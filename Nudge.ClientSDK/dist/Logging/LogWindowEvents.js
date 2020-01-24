import registry from "../Util/registry";
function logErrorEvent(errorEvent) {
    try {
        var message = errorEvent.message, error = errorEvent.error;
        registry.logger.error(message, error);
    }
    catch (e) {
        // Don't throw exceptions in logger since it turns into an infinite loop
    }
}
function logPromiseRejectionEvent(promiseRejectionEvent) {
    try {
        var reason = promiseRejectionEvent.reason;
        var message = reason.message;
        registry.logger.error(message, reason);
    }
    catch (e) {
        // Don't throw exceptions in logger since it turns into an infinite loop
    }
}
export var setupWindowErrorEvent = function () { return window.addEventListener("error", logErrorEvent); };
export var setupWindowUnhandledRejectionEvent = function () { return window.addEventListener("unhandledrejection", logPromiseRejectionEvent); };
//# sourceMappingURL=LogWindowEvents.js.map