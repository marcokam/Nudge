import { Predicate, Comparator } from "./function";
import { Applicative1, Applicative2 } from "./Algebras/Applicative";
/**
 * Array utils
 */
export declare const reverse: <A>(as: A[]) => A[];
export declare const sort: <A>(f: Comparator<A>) => (as: A[]) => A[];
export declare const every: <A>(f: Predicate<A>) => (as?: A[]) => boolean;
export declare const some: <A>(f: Predicate<A>) => (as?: A[]) => boolean;
export declare const filter: <A>(f: Predicate<A>) => (as?: A[]) => A[];
export declare const filterUndef: <T>(ts: (T | undefined)[]) => T[];
export declare const map: <A, B>(f: (a: A) => B) => (as?: A[]) => B[];
export declare const reduce: <A, B>(f: (acc: B, v: A) => B, init: B) => (as?: A[]) => B;
export declare const flatten: <A>(a: A[][]) => A[];
export declare const groupBy: <A>(f: (a: A) => string) => (as?: A[]) => {
    [k: string]: A[];
};
export declare const uniq: <A>(as?: A[]) => A[];
export declare const uniqBy: <A, B>(f: (a: A) => B) => (as?: A[]) => A[];
export declare const optHead: <A>(as?: A[]) => import("./Instances/Option").Some<NonNullable<A>> | import("./Instances/Option").None<NonNullable<A>>;
export declare const head: <A>(as?: A[]) => NonNullable<A> | undefined;
export declare const tail: <A>(as?: A[]) => A[];
export declare const optLast: <A>(as?: A[]) => import("./Instances/Option").Some<NonNullable<A>> | import("./Instances/Option").None<NonNullable<A>>;
export declare const last: <A>(as?: A[]) => NonNullable<A> | undefined;
export declare const range: (a: number, b?: number | undefined) => number[];
export declare const isEmpty: <A>(as: A[]) => boolean;
export declare const optFind: <A>(f: Predicate<A>) => (as: A[]) => import("./Instances/Option").Some<NonNullable<A>> | import("./Instances/Option").None<NonNullable<A>>;
export declare const empty: never[];
export declare const traverse1: <F extends "Option" | "List" | "Pred" | "Compare", A, B>(F: Applicative1<F>) => (f: (a: A) => import("./Instances/URI2HKT").URI2HKT<B>[F]) => (as: A[]) => import("./Instances/URI2HKT").URI2HKT<B[]>[F];
export declare const traverse2: <F extends "Task" | "Either" | "Pair" | "Prism" | "Arrow", E, A, B>(F: Applicative2<F>) => (f: (a: A) => import("./Instances/URI2HKT").URI2HKT2<E, B>[F]) => (as: A[]) => import("./Instances/URI2HKT").URI2HKT2<E, B[]>[F];
export declare const sequence1: <F extends "Option" | "List" | "Pred" | "Compare", A>(F: Applicative1<F>) => (as: import("./Instances/URI2HKT").URI2HKT<A>[F][]) => import("./Instances/URI2HKT").URI2HKT<A[]>[F];
export declare const sequence2: <F extends "Task" | "Either" | "Pair" | "Prism" | "Arrow", E, A>(F: Applicative2<F>) => (as: import("./Instances/URI2HKT").URI2HKT2<E, A>[F][]) => import("./Instances/URI2HKT").URI2HKT2<E, A[]>[F];
export declare const splitEvery: <A>(n: number) => (as: A[]) => A[][];
