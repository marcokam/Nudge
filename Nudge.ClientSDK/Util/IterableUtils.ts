import { Comparer } from "../Comparison/ComparisonInterfaces";
import { reverseComparer, defaultComparerDescending, defaultComparerAscending } from "../Comparison/Comparers";

const alwaysPredicate = () => true;

export function *filter<T>(iterable: Iterable<T>, predicate: ((x: T) => boolean)): IterableIterator<T> {
    for (let item of iterable) {
        if (predicate(item)) yield item;
    }
}

export function any<T>(iterable: Iterable<T>, predicate?: ((x: T) => boolean)): boolean {
    const actualPredicate = predicate || alwaysPredicate;
    for (let item of iterable) {
        if (actualPredicate(item)) return true;
    }
    return false;
}

export function *map<T, U>(iterable: Iterable<T>, mapper: (item: T) => U): IterableIterator<U> {
    for (let item of iterable) {
        yield mapper(item);
    }
}

export function reduce<T, U>(iterable: Iterable<T>, aggregator: (acc: U, item: T) => U, start: U): U {
    let acc = start;
    for (let item of iterable) {
        acc = aggregator(acc, item);
    }
    return acc;
}

export function first<T>(iterable: Iterable<T>): T | null {
    for (let item of iterable) {
        return item;
    }
    return null;
}

export function *flatMap<T, U>(iterable: Iterable<T>, mapper: (item: T) => Iterable<U>): Iterable<U> {
    for (let item of iterable) {
        for (let item2 of mapper(item)) {
            yield item2;
        }
    }
}

export function *uniqBy<T, K>(iterable: Iterable<T>, keyFn: (item: T) => K): Iterable<T> {
    const seen = new Set<K>();    
    for (let item of iterable) {
        const key = keyFn(item);
        if (!seen.has(key)) {
            seen.add(key);
            yield item;
        }
    }
}

export function *reverse<T>(iterable: Iterable<T>): Iterable<T> {
    const asArray: T[] = Array.from(iterable);    
    for (let i = asArray.length - 1; i >= 0; i--) {
        yield asArray[i];
    }
}

export function *range(start: number, end: number, step: number = 1): Iterable<number> {
    for (let i = start; i <= end; i += step) {
        yield i;
    }
}

export function min<T>(iterable: Iterable<T>, comparer?: Comparer<T>): T | undefined {
    const actualComparer = comparer || defaultComparerAscending;
    let result: T | undefined = undefined;
    for (let item of iterable) {
        if (result === undefined || actualComparer(result, item) > 0) {
            result = item;            
        }
    }
    return result;
}

export function max<T>(iterable: Iterable<T>, comparer?: Comparer<T>): T | undefined {
    const actualComparer = (comparer && reverseComparer(comparer)) || defaultComparerDescending;
    return min(iterable, actualComparer);
}

export function forEach<T>(iterable: Iterable<T>, callback: (item: T) => void): void {
    for (let item of iterable) {
        callback(item);
    }
}