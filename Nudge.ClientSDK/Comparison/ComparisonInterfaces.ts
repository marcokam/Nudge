// Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
// Returns a number that indicates the relative values of x and y:
//  * Less than zero    : x is less than y
//  * Zero	            : x equals y
//  * Greater than zero	: x is greater than y
export type Comparer<T> = (x: T, y: T) => number;;

// Hashes an object.  Useful for quickly comparing sets of objects.
export type GetHashCode<T> = (x: T) => number;

// Compares two objects for equality.
export type AreEqual<T> = (x: T, y: T) => boolean;

// Combination of AreEqual and GetHashCode
export interface EqualityComparer<T> {
    getHashCode: GetHashCode<T>;
    areEqual: AreEqual<T>;
}