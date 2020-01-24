import { Monoid1 } from "../Algebras/Monoid";
import { Contravariant1 } from "../Algebras/Contravariant";
import { Comparator } from "../function";
export declare const URI = "Compare";
export declare type URI = typeof URI;
export declare class Compare<A> {
    readonly tag: "Compare";
    private readonly value;
    static of: <A_1>(a: Comparator<A_1>) => Compare<A_1>;
    static empty: <A_1>() => Compare<A_1>;
    constructor(a: Comparator<A>);
    readonly run: (a: A, b: A) => import("../../sortUtils").CompareResult;
    readonly contramap: <B>(f: (b: B) => A) => Compare<B>;
    readonly concat: (compareA: Compare<A>) => Compare<A>;
}
export declare const contramap: <A, B>(f: (a: B) => A) => (compareA: Compare<A>) => Compare<B>;
export declare const concat: <A>(compareA1: Compare<A>) => (compareA2: Compare<A>) => Compare<A>;
export declare const empty: <A>() => Compare<A>;
export declare const pred: Contravariant1<URI> & Monoid1<URI>;
