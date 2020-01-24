import { Result, Task } from "./Task";
import { isFunction } from "~/Util/utils";
import { Lazy } from "../function";
import LazyValue from "~/Util/LazyValue";

type SyncProducer<A> = Lazy<A>;
type AsyncProducer<A> = Lazy<Promise<A>>;
type ResultProducer<A> = Lazy<Result<A>>;
type ValueProducer<A> = SyncProducer<A> | AsyncProducer<A> | ResultProducer<A>;

type Value<A> = A | Result<A> | Promise<A>;

type Producer<A> = Value<A> | ValueProducer<A>;

const isValueProducer = <A>(p: Producer<A>): p is ValueProducer<A> => isFunction(p);
export const valueToPromise = <A>(v: Value<A>) => v instanceof Promise ? v : v instanceof Task ? Task.toPromise(v) : Promise.resolve(v);

// Execution is not deferred.  Do NOT export this.  
const toPromise = <A>(p: Producer<A>): Promise<A> => {
    if (!isValueProducer(p)) {
        return valueToPromise(p);
    }

    return valueToPromise(p());
}

// Flatten a Producer to a lazy Promise.  The result of invoking Producer is cached, therefore the provided Producer will only be invoked once.
// Execution is deferred until the resulting function is called.
export const toLazyPromise = <A>(p: Producer<A>): Lazy<Promise<A>> => new LazyValue(() => toPromise(p)).getValue;

// Flatten a Producer to a Result.  The result of invoking Producer is not cached, therefore the provided Producer could be invoked multiple times.
// Execution is deferred until the resulting Task is forked.
export const toResult = <A>(p: Producer<A>): Result<A> => new Task<Error, A>(() => toPromise(p));

// Flatten a Producer to a Result.  The result of invoking Producer is cached, therefore the provided Producer will only be invoked once.
// Execution is deferred until the resulting Task is forked.
export const toCachedResult = <A>(p: Producer<A>): Result<A> => new Task<Error, A>(toLazyPromise<A>(p));

/* Provides a type that can actually be several different types.  This allows a function to accept a multitude of types and consumers can choose how they wish to specify them.
   Use `toResult` to flatten all of these types down to just a Result<A>.
   Use `toCachedResult` to flatten to Result<A> but underlying Producer is only executed once and result is cached.
   Use `toLazyPromise` to flatten to () => Promise<A>.  Underlying Producer is only executed once and result is cached.
   We could make a `toPromise` function, but that would not allow deferred execution and would kind of defeat the purpose.
   Possible types include:
    * A value
    * A function that produces a value
    * A Result
    * A function that produces a Result
    * A Promise
    * A function that produces a Promise
*/
export default Producer;