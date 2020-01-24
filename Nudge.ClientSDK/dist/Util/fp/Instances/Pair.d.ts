import { Bifunctor2 } from "../Algebras/Bifunctor";
export declare const URI = "Pair";
export declare type URI = typeof URI;
export declare class Pair<A, B> {
    readonly tag: "Pair";
    private readonly value;
    static of: <A_1, B_1>(a: A_1, b: B_1) => Pair<A_1, B_1>;
    constructor(a: A, b: B);
    readonly fst: () => A;
    readonly snd: () => B;
    readonly toArray: () => [A, B];
    readonly merge: <C>(f: (a: A, b: B) => C) => C;
    readonly map: <C>(f: (b: B) => C) => Pair<A, C>;
    readonly bimap: <C, D>(f: (a: A) => C, g: (b: B) => D) => Pair<C, D>;
}
export declare const map: <A, B, C>(f: (b: B) => C) => (pairAB: Pair<A, B>) => Pair<A, C>;
export declare const bimap: <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) => (pairAB: Pair<A, B>) => Pair<C, D>;
export declare const pair: Bifunctor2<URI>;
