import { Lazy } from "../function";
import { Monad1 } from "../Algebras/Monad";
import { Applicative1, Applicative2 } from "../Algebras/Applicative";
export declare const URI = "Option";
export declare type URI = typeof URI;
declare type Return<A> = A extends (...args: any[]) => infer R ? R : never;
export declare class None<A> {
    private readonly tag;
    readonly map: <B>(f: (a: A) => B) => Option<B>;
    readonly ap: <B>(Ob: Option<B>) => Option<Return<A>>;
    readonly chain: <B>(f: (a: A) => Option<B>) => Option<B>;
    readonly traverse1: <F extends "Option" | "List" | "Pred" | "Compare", B>(F: Applicative1<F>, f: (a: A) => import("./URI2HKT").URI2HKT<B>[F]) => import("./URI2HKT").URI2HKT<Option<B>>[F];
    readonly traverse2: <F extends "Task" | "Either" | "Pair" | "Prism" | "Arrow", E, B>(F: Applicative2<F>, f: (a: A) => import("./URI2HKT").URI2HKT2<E, B>[F]) => import("./URI2HKT").URI2HKT2<E, Option<B>>[F];
    readonly getOrElse: <D>(f: Lazy<D>) => A | D;
}
export declare const none: Option<never>;
export declare class Some<A> {
    private readonly tag;
    private readonly value;
    constructor(value: A);
    readonly map: <B>(f: (a: A) => B) => Option<B>;
    readonly ap: <B>(Ob: Option<B>) => Option<Return<A>>;
    readonly chain: <B>(f: (a: A) => Option<B>) => Option<B>;
    readonly traverse1: <F extends "Option" | "List" | "Pred" | "Compare", B>(F: Applicative1<F>, f: (a: A) => import("./URI2HKT").URI2HKT<B>[F]) => import("./URI2HKT").URI2HKT<Option<B>>[F];
    readonly traverse2: <F extends "Task" | "Either" | "Pair" | "Prism" | "Arrow", E, B>(F: Applicative2<F>, f: (a: A) => import("./URI2HKT").URI2HKT2<E, B>[F]) => import("./URI2HKT").URI2HKT2<E, Option<B>>[F];
    readonly getOrElse: <D>(f: Lazy<D>) => A | D;
}
export declare const some: <A>(a: A) => Some<A>;
export declare type Option<A> = Some<NonNullable<A>> | None<NonNullable<A>>;
export declare const map: <A, B>(f: (a: A) => B) => (Oa: Option<A>) => Option<B>;
export declare const ap: <A, B>(Oab: Option<(a: A) => B>) => (Oa: Option<A>) => Option<B>;
export declare const chain: <A, B>(f: (a: A) => Option<B>) => (Oa: Option<A>) => Option<B>;
export declare const of: <A>(a: A) => Option<A>;
export declare const option: Monad1<URI>;
export declare const tryCatch: <A>(f: Lazy<A>) => Some<NonNullable<A>> | None<NonNullable<A>>;
export {};
