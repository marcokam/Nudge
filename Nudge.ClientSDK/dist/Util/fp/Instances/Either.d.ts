import { Lazy } from "../function";
import { Monad2 } from "../Algebras/Monad";
export declare const URI = "Either";
export declare type URI = typeof URI;
declare type Return<A> = A extends (...args: any[]) => infer R ? R : never;
export declare class Left<E, A> {
    private readonly tag;
    readonly right: never;
    readonly left: E;
    constructor(left: E);
    readonly map: <B>(f: (a: A) => B) => Either<E, B>;
    readonly ap: <B>(Eb: Either<E, B>) => Either<E, Return<A>>;
    readonly chain: <B>(f: (a: A) => Either<E, B>) => Either<E, B>;
    readonly getOrElse: <D>(f: (e: E) => D) => D;
    readonly fold: (l: (e: E) => any, r: (a: A) => any) => any;
}
export declare const left: <E = never, A = never>(e: E) => Either<E, never>;
export declare class Right<E, A> {
    private readonly tag;
    readonly right: A;
    readonly left: never;
    constructor(right: A);
    readonly map: <B>(f: (a: A) => B) => Either<E, B>;
    readonly ap: <B>(eitherB: Either<E, B>) => Either<E, Return<A>>;
    readonly chain: <B>(f: (a: A) => Either<E, B>) => Either<E, B>;
    readonly getOrElse: (e?: any) => A;
    readonly fold: (l: (e: E) => any, r: (a: A) => any) => any;
}
export declare type Either<E, A> = Left<E, A> | Right<E, A>;
export declare const right: <E, A>(a: A) => Either<E, A>;
export declare const map: <E, A, B>(f: (a: A) => B) => (eitherA: Either<E, A>) => Either<E, B>;
export declare const ap: <E, A, B>(eitherAToB: Either<E, (a: A) => B>) => (eitherA: Either<E, A>) => Either<E, B>;
export declare const chain: <E, A, B>(f: (a: A) => Either<E, B>) => (eitherA: Either<E, A>) => Either<E, B>;
export declare const of: <E, A>(a: A) => Either<E, A>;
export declare const either: Monad2<URI>;
export declare const tryCatch: <E, A>(f: Lazy<A>) => Either<E, A>;
export {};
