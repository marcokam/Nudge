import {
    filter,
    map,
    reduce,
    first,
    flatMap,
    uniqBy,
    reverse,
    range,
    min,
    max,
    any
} from "./IterableUtils";
import { Comparer } from "~/Comparison/ComparisonInterfaces";

// The generator functions in IterableUtils are not re-runnable.  
// Wrap them in this to make them called every time the consumer asks
// for an Iterator.
function produce<T>(fn: () => Iterable<T>): Iterable<T> {
    return {
        [Symbol.iterator]: () => fn()[Symbol.iterator]()
    }
}

export default class NudgeIterable<T> implements Iterable<T> {
    
    [Symbol.iterator] = (): Iterator<T> => this.wrapped[Symbol.iterator]();

    private readonly wrapped: Iterable<T>;

    constructor(wrapped: Iterable<T>) {
        this.wrapped = wrapped;
    }

    static fromIterable = <T>(items: Iterable<T>) => new NudgeIterable<T>(items);
    static fromArray = <T>(items: T[]) => new NudgeIterable<T>(items);
    static fromItems = <T>(...items: T[]) => new NudgeIterable<T>(items);
    static fromEmpty = <T>() => new NudgeIterable<T>([]);
    static fromRange = (start: number, end: number, step: number = 1) => new NudgeIterable(range(start, end, step));

    filter = (predicate: ((x: T) => boolean)) => new NudgeIterable<T>(
        produce(() => filter(this.wrapped, predicate))
    );

    map = <U>(mapper: (item: T) => U) => new NudgeIterable<U>(
        produce(() => map(this.wrapped, mapper))
    );

    reduce = <U>(aggregator: (acc: U, item: T) => U, start: U): U =>
        reduce(this.wrapped, aggregator, start);

    first = (): T | null =>
        first(this.wrapped);

    flatMap = <U>(mapper: (item: T) => Iterable<U>) => new NudgeIterable<U>(
        produce(() => flatMap(this.wrapped, mapper))
    );

    uniqBy = <K>(keyFn: (item: T) => K) => new NudgeIterable<T>(
        produce(() => uniqBy(this.wrapped, keyFn))
    );

    reverse = () => new NudgeIterable<T>(
        produce(() => reverse(this.wrapped))
    );

    toArray = () =>
        Array.from(this.wrapped);

    min = (comparer?: Comparer<T>) =>
        min(this.wrapped, comparer);
        
    max = (comparer?: Comparer<T>) =>
        max(this.wrapped, comparer);

    any = (predicate?: ((x: T) => boolean)): boolean => (
        any(this.wrapped, predicate)
    );
}
