import { Comparer } from "../Comparison/ComparisonInterfaces";
export default class NudgeIterable<T> implements Iterable<T> {
    [Symbol.iterator]: () => Iterator<T, any, undefined>;
    private readonly wrapped;
    constructor(wrapped: Iterable<T>);
    static fromIterable: <T_1>(items: Iterable<T_1>) => NudgeIterable<T_1>;
    static fromArray: <T_1>(items: T_1[]) => NudgeIterable<T_1>;
    static fromItems: <T_1>(...items: T_1[]) => NudgeIterable<T_1>;
    static fromEmpty: <T_1>() => NudgeIterable<T_1>;
    static fromRange: (start: number, end: number, step?: number) => NudgeIterable<number>;
    filter: (predicate: (x: T) => boolean) => NudgeIterable<T>;
    map: <U>(mapper: (item: T) => U) => NudgeIterable<U>;
    reduce: <U>(aggregator: (acc: U, item: T) => U, start: U) => U;
    first: () => T | null;
    flatMap: <U>(mapper: (item: T) => Iterable<U>) => NudgeIterable<U>;
    uniqBy: <K>(keyFn: (item: T) => K) => NudgeIterable<T>;
    reverse: () => NudgeIterable<T>;
    toArray: () => T[];
    min: (comparer?: Comparer<T> | undefined) => T | undefined;
    max: (comparer?: Comparer<T> | undefined) => T | undefined;
    any: (predicate?: ((x: T) => boolean) | undefined) => boolean;
}
