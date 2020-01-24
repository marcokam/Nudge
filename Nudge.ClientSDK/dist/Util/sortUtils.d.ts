declare type GT = 1;
declare type LT = -1;
declare type EQ = 0;
export declare type CompareResult = EQ | GT | LT;
export declare type Comparator<B> = (a: B, b: B) => CompareResult;
export interface Ordering {
    [k: string]: number;
}
/**
 * Standard sort comparator functions for array.prototype.sort
 */
export declare const alphaCompareByDir: (asc?: boolean) => (a?: string, b?: string) => CompareResult;
export declare const numCompareByDir: (asc?: boolean) => (a?: number, b?: number) => CompareResult;
export declare const truthyCompareByDir: (asc?: boolean) => (a?: boolean, b?: boolean) => CompareResult;
export declare const bothExistsCompareByDir: (asc?: boolean) => <A>(a?: A | undefined, b?: A | undefined) => CompareResult;
export declare const dateCompare: (asc?: boolean) => (a?: string, b?: string) => CompareResult;
/**
 * Generate a comparator by passing in a map function to first map the inputs, then a regular comparator to do the comparing
 */
export declare const mapThenCompare: <A, B>(map: (a: A) => B) => (comparator: Comparator<B>) => (a: A, b: A) => CompareResult;
/**
 * Combine multiple comparators together by falling through to next one if it returns EQ
 */
export declare const combineComparators: <A>(comparators: Comparator<A>[]) => Comparator<A>;
/**
 * Custom comparators
 */
export declare const sortValueLast: (val: string, last?: boolean) => (a: unknown, b: unknown) => CompareResult;
/**
 * Convert an array of strings into an `Ordering`, using the index as the order
 */
export declare const valuesToOrdering: (values: string[]) => {
    [x: string]: number;
};
export declare const generateOrdering: <A>(a: A) => {
    typeToOrdering: (k: keyof A) => import("./fp/Instances/Option").Some<NonNullable<Record<keyof A, number>[keyof A]>> | import("./fp/Instances/Option").None<NonNullable<Record<keyof A, number>[keyof A]>>;
    orderingToType: (n: number) => import("./fp/Instances/Option").Some<NonNullable<keyof A>> | import("./fp/Instances/Option").None<NonNullable<keyof A>>;
};
export {};
