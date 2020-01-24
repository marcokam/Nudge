import { map } from "./IterableUtils";
import AggregateError from "./AggregateError";

// This wraps any function as a promise.
// Any exceptions in that function result in a rejected promise
// regardless of whether that exception happened synchronously or
// asynchronously.
// See:
//  * https://github.com/tc39/proposal-promise-try
//  * http://bluebirdjs.com/docs/api/promise.try.html
export function promiseTry<T>(fn: () => Promise<T>) {
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
export function reusableSingleton<T>(fn: () => Promise<T>): () => Promise<T> {
    let inflight: Promise<T> | null = null;
    return () => {
        if (inflight === null) {
            inflight = promiseTry(fn);
            // Save it before we clear it
            const thisInflight = inflight;
            inflight.finally(() => inflight = null);
            return thisInflight;
        }
        return inflight;
    };
}

// Creates a promise that will resolve after a number of milliseconds specified by "timeoutMs".
// It will resolve to "resolveObject" if specified.
export function TimeoutPromise<T>(timeoutMs: number, resolveObject: T): Promise<T> {
    return new Promise(resolve => setTimeout(resolve, timeoutMs, resolveObject));
}

export const emptyPromise: Promise<null> = Promise.resolve(null);
export const voidPromise: Promise<void> = Promise.resolve();

//TODO: Can we do this with AbortController?? This is nuts.
interface TimeoutObject { "@@Timeout": boolean };
const timeoutObject: TimeoutObject = { "@@Timeout": true };
export function RaceTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {    
    const timeoutPromise: Promise<TimeoutObject> = new Promise(resolve => setTimeout(resolve, timeoutMs, timeoutObject));
    const racing: Promise<T | TimeoutObject> = Promise.race([promise, timeoutPromise]);
    return racing
        .then(result => {
            const maybeTimeout = (result as TimeoutObject)["@@Timeout"];
            if (maybeTimeout) {
                return emptyPromise;
            }
            return Promise.resolve(result as T);
        });
}

export const createTimeoutAbortSignal = (timeoutMs: number): AbortSignal => {    
    const controller = new AbortController();
    setTimeout(controller.abort.bind(controller), timeoutMs);
    return controller.signal;
}

export const onSignalAbort = (signal: AbortSignal, fn: () => void) => {
    signal.addEventListener("abort", fn);
};

export const joinAbortSignals = (...args: AbortSignal[]) => {
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

// Causes errors in multiple map functions to be joined into a single error.
// Simply using Promise.all would reject as soon as the first promise rejects
// and other rejections would result in "unhandledrejection" events.
//
// Additionally this operates on both synchronous and asynchronous errors.
export const mapAndJoinErrors = <T, U>(input: Iterable<T>, mapFn: (item: T) => Promise<U>): Promise<U[]> => {
    
    // When there is an error this value will never actually be used
    // but we add it anyways just to make the types line up.
    const valueOnError = Promise.resolve(null as any as U);

    // Track errors
    const errors: any[] = [];

    // Save both sync and async errors
    const promises = map(input, item => {
        try {
            return mapFn(item)
                .catch(reason => { errors.push(reason); })
                .then(() => valueOnError);
        } catch (err) {
            errors.push(err);
            return valueOnError;
        }
    });

    // Wait for all promises to resolve, and throw any errors.
    return Promise.all(promises).then((results: U[]): U[] => {
        if (errors.length === 0) {
            return results;
        } else if (errors.length === 1) {
            throw errors[0];
        } else {
            throw new AggregateError(errors);
        }
    });
}