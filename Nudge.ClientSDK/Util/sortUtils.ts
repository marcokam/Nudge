import { isBefore } from "date-fns";
import { option } from "./fp/Instances/Option";
import { Arrow } from "./fp/Instances/Arrow";
import { Pair } from "./fp/Instances/Pair";
import { fromEntries } from "./fp/object";

type GT = 1;
type LT = -1;
type EQ = 0;
export type CompareResult = EQ | GT | LT;
export type Comparator<B> = (a: B, b: B) => CompareResult;
export interface Ordering { [k: string]: number };

/**
 * Standard sort comparator functions for array.prototype.sort 
 */
export const alphaCompareByDir = (asc = false) => (a = "", b = "") => (asc ? a.localeCompare(b) : b.localeCompare(a)) as CompareResult;
export const numCompareByDir = (asc = false) => (a = 0, b = 0) => (a === b ? 0 : (asc ? a < b : b < a) ? -1 : 1) as CompareResult;
export const truthyCompareByDir = (asc = false) => (a = false, b = false) => (a === b ? 0 : (asc ? !a : !b) ? -1 : 1) as CompareResult;
export const bothExistsCompareByDir = (asc = false) => <A>(a?: A, b?: A) => (a && b) ? 0 : (asc ? (a ? -1 : 1) : (a ? -1 : 1)) as CompareResult;
export const dateCompare = (asc = false) => (a = "", b = "") => (asc ? isBefore(a, b) ? -1 : 1 : isBefore(a, b) ? 1 : -1) as CompareResult;

/**
 * Generate a comparator by passing in a map function to first map the inputs, then a regular comparator to do the comparing
 */
export const mapThenCompare = <A, B>(map: (a: A) => B) => (comparator: Comparator<B>) => (a: A, b: A) => comparator(map(a), map(b));

/**
 * Combine multiple comparators together by falling through to next one if it returns EQ 
 */
export const combineComparators = <A>(comparators: Comparator<A>[]) => comparators
    .reduce((acc, comparator) => (a: A, b: A) => option.of(acc(a, b))
        .map(res => res === 0 ? comparator(a, b) : res)
        .getOrElse(() => 0), (a: A, b: A) => 0);    // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Custom comparators
 */
// Sort value first or last
export const sortValueLast = (val: string, last = false) => mapThenCompare(x => x === val)(truthyCompareByDir(last));

// Turn an array of values into an object where the key is the string value and
//  the index in the array is the value

/**
 * Convert an array of strings into an `Ordering`, using the index as the order
 */
export const valuesToOrdering = (values: string[]) => values.reduce((acc: { [k: string]: number }, val, ind) => ({ ...acc, [val]: ind }), {} as unknown as Record<string, number>);
const typeToOrdering = <A>(t: A) => (Object.keys(t) as unknown as [keyof A]).reduce((acc, val, ind) => ({ ...acc, [val]: ind}), {} as unknown as Record<keyof A, number>);
const orderingMap = <A>(o: Record<keyof A, number>) => fromEntries(Object.entries(o).map(([k, v]) => [v, k]) as unknown as [number, keyof A][]);
export const generateOrdering = <A>(a: A) => Arrow.of(
    (ordering: Record<keyof A, number>) => Pair.of(
        Arrow.of((o: Record<keyof A, number>) => (k: keyof A) => option.of(o[k])).run(ordering),
        Arrow.of((m: Record<number, keyof A>) => (n: number) => option.of(m[n]))
            .contramap<Record<keyof A, number>>(orderingMap)
            .run(ordering),
    ).merge((typeToOrdering, orderingToType) => ({ typeToOrdering, orderingToType })))
    .contramap<A>(typeToOrdering)
    .run(a);
