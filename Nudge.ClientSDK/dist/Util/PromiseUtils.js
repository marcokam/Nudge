import { map } from "./IterableUtils";
import AggregateError from "./AggregateError";
// This wraps any function as a promise.
// Any exceptions in that function result in a rejected promise
// regardless of whether that exception happened synchronously or
// asynchronously.
// See:
//  * https://github.com/tc39/proposal-promise-try
//  * http://bluebirdjs.com/docs/api/promise.try.html
export function promiseTry(fn) {
    return Promise.resolve().then(function () {
        return fn();
    });
}
// Similar to the concept of a singleton promise, 
// except that once the promise completes the next call
// will create a new execution.
// Useful if you only want concurrent executions to join
// but do not save a permanent value.
// See these for examples of singleton promises that are not reusable:
//   * https://www.npmjs.com/package/async-singleton
//   * https://gist.github.com/thomasmichaelwallace/cd77294cac8b6b4ecf054bf2a42fe7fc
export function reusableSingleton(fn) {
    var inflight = null;
    return function () {
        if (inflight === null) {
            inflight = promiseTry(fn);
            // Save it before we clear it
            var thisInflight = inflight;
            inflight.finally(function () { return inflight = null; });
            return thisInflight;
        }
        return inflight;
    };
}
// Creates a promise that will resolve after a number of milliseconds specified by "timeoutMs".
// It will resolve to "resolveObject" if specified.
export function TimeoutPromise(timeoutMs, resolveObject) {
    return new Promise(function (resolve) { return setTimeout(resolve, timeoutMs, resolveObject); });
}
export var emptyPromise = Promise.resolve(null);
export var voidPromise = Promise.resolve();
;
var timeoutObject = { "@@Timeout": true };
export function RaceTimeout(promise, timeoutMs) {
    var timeoutPromise = new Promise(function (resolve) { return setTimeout(resolve, timeoutMs, timeoutObject); });
    var racing = Promise.race([promise, timeoutPromise]);
    return racing
        .then(function (result) {
        var maybeTimeout = result["@@Timeout"];
        if (maybeTimeout) {
            return emptyPromise;
        }
        return Promise.resolve(result);
    });
}
export var createTimeoutAbortSignal = function (timeoutMs) {
    var controller = new AbortController();
    setTimeout(controller.abort.bind(controller), timeoutMs);
    return controller.signal;
};
export var onSignalAbort = function (signal, fn) {
    signal.addEventListener("abort", fn);
};
export var joinAbortSignals = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var controller = new AbortController();
    if (args) {
        args.forEach(function (signal) {
            if (signal) {
                onSignalAbort(signal, controller.abort.bind(controller));
            }
        });
    }
    return controller.signal;
};
// Causes errors in multiple map functions to be joined into a single error.
// Simply using Promise.all would reject as soon as the first promise rejects
// and other rejections would result in "unhandledrejection" events.
//
// Additionally this operates on both synchronous and asynchronous errors.
export var mapAndJoinErrors = function (input, mapFn) {
    // When there is an error this value will never actually be used
    // but we add it anyways just to make the types line up.
    var valueOnError = Promise.resolve(null);
    // Track errors
    var errors = [];
    // Save both sync and async errors
    var promises = map(input, function (item) {
        try {
            return mapFn(item)
                .catch(function (reason) { errors.push(reason); })
                .then(function () { return valueOnError; });
        }
        catch (err) {
            errors.push(err);
            return valueOnError;
        }
    });
    // Wait for all promises to resolve, and throw any errors.
    return Promise.all(promises).then(function (results) {
        if (errors.length === 0) {
            return results;
        }
        else if (errors.length === 1) {
            throw errors[0];
        }
        else {
            throw new AggregateError(errors);
        }
    });
};
//# sourceMappingURL=PromiseUtils.js.map