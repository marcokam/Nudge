import SignalAbortedError from "~/App/Errors/SignalAbortedError.js";

// This wraps any function as a promise.
// Any exceptions in that function result in a rejected promise 
// regardless of whether that exception happened synchronously or 
// asynchronously.
// See:
//  * https://github.com/tc39/proposal-promise-try
//  * http://bluebirdjs.com/docs/api/promise.try.html
export function promiseTry(fn) {
    return Promise.resolve().then(() => {        
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
    let inflight = null;
    return () => {
        if (inflight === null) {
            inflight = promiseTry(fn).finally(result => {
                inflight = null;
                return result;
            });
        }
        return inflight;
    };
}

export const joinAbortSignals = (...args) => {
    const controller = new AbortController();
    if (args) {
        args.forEach(signal => {
            if (signal) {
                onSignalAbort(signal, controller.abort.bind(controller));
            }
        });
    }
    return controller.signal;
};

export const isAbortError = (err) => err && err.name === "AbortError";

export const abortErrorToSignalAbortedError = err => {
    if (isAbortError(err)) {
        throw new SignalAbortedError();
    }
    throw err;
};

export const timeoutAbortSignal = (timeoutMs) => {
    const controller = new AbortController();
    setTimeout(controller.abort.bind(controller), timeoutMs);
    return controller.signal;
};  

export const onSignalAbort = (signal, fn) => {
    signal.addEventListener('abort', fn);
};

export const ignoreAbortError = (err) => {
    if (!isAbortError(err)) {
        throw err;
    }
};