import { Contravariant2 } from "../Algebras/Contravariant";
import { Functor2 } from "../Algebras/Functor";
declare const URI = "Arrow";
export declare type URI = typeof URI;
export declare class Arrow<A, B> {
    readonly tag: "Arrow";
    private readonly value;
    static of: <A_1, B_1>(f: (a: A_1) => B_1) => Arrow<A_1, B_1>;
    constructor(f: (a: A) => B);
    readonly run: (a: A) => B;
    readonly map: <C>(f: (b: B) => C) => Arrow<A, C>;
    readonly contramap: <C>(f: (c: C) => A) => Arrow<C, B>;
}
export declare const map: <A, B, C>(f: (b: B) => C) => (arrowAB: Arrow<A, B>) => Arrow<A, C>;
export declare const contramap: <A, B, C>(f: (c: C) => A) => (arrowAB: Arrow<A, B>) => Arrow<C, B>;
export declare const of: <A, B>(f: (a: A) => B) => Arrow<A, B>;
export declare const arrow: Contravariant2<URI> & Functor2<URI>;
export {};
