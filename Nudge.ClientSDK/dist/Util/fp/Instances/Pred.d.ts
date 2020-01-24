import { Monoid1 } from "../Algebras/Monoid";
import { Contravariant1 } from "../Algebras/Contravariant";
import { Predicate } from "../function";
export declare const URI = "Pred";
export declare type URI = typeof URI;
export declare class Pred<A> {
    readonly tag: "Pred";
    private readonly value;
    static of: <A_1>(a: Predicate<A_1>) => Pred<A_1>;
    static empty: <A_1>() => Pred<A_1>;
    static not: <A_1>(p: Pred<A_1>) => Pred<A_1>;
    constructor(a: Predicate<A>);
    readonly run: (a: A) => boolean;
    readonly contramap: <B>(f: (b: B) => A) => Pred<B>;
    readonly concat: (predA: Pred<A>) => Pred<A>;
    readonly concatOr: (predA: Pred<A>) => Pred<A>;
}
export declare const contramap: <A, B>(f: (b: B) => A) => (predA: Pred<A>) => Pred<B>;
export declare const concat: <A>(predA1: Pred<A>) => (predA2: Pred<A>) => Pred<A>;
export declare const empty: <A>() => Pred<A>;
export declare const pred: Contravariant1<URI> & Monoid1<URI>;
