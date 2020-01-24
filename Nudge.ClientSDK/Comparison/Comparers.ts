import { Comparer } from "./ComparisonInterfaces";

export function reverseComparer<T>(comparer: Comparer<T>) {
    return (x: T, y: T) => {
        const result = comparer(x, y);
        if (result === 0) return 0;
        if (result < 0) return 1;
        return -1;
    }
}

export const defaultComparerAscending: Comparer<any> = (x, y) => {
    if (x === y) return 0;
    if (x < y) return -1;
    return 1;
}

export const defaultComparerDescending: Comparer<any> = reverseComparer(defaultComparerAscending);

