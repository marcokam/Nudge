export declare type Comparer<T> = (x: T, y: T) => number;
export declare type GetHashCode<T> = (x: T) => number;
export declare type AreEqual<T> = (x: T, y: T) => boolean;
export interface EqualityComparer<T> {
    getHashCode: GetHashCode<T>;
    areEqual: AreEqual<T>;
}
