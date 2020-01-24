import { Comparer } from "./ComparisonInterfaces";
export declare function reverseComparer<T>(comparer: Comparer<T>): (x: T, y: T) => 1 | 0 | -1;
export declare const defaultComparerAscending: Comparer<any>;
export declare const defaultComparerDescending: Comparer<any>;
