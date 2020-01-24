
import { Monoid1 } from "../Algebras/Monoid";
import { Contravariant1 } from "../Algebras/Contravariant";
import { Comparator } from "../function";

export const URI = "Compare";
export type URI = typeof URI;
 
export class Compare<A> {
    readonly tag: "Compare" = "Compare";
    private readonly value: Comparator<A>;
    static of = <A>(a: Comparator<A>): Compare<A> => new Compare(a);
    static empty = <A>() => new Compare(() => 0) as unknown as Compare<A>;
    
    constructor(a: Comparator<A>) {
        this.value = a;
    }
    
    readonly run = (a: A, b: A) => this.value(a, b);
    readonly contramap = <B>(f: (b: B) => A): Compare<B> => new Compare((a: B, b: B ) => this.run(f(a), f(b)));
    readonly concat = (compareA: Compare<A>): Compare<A> => new Compare((a: A, b: A) => this.run(a, b) || compareA.run(a, b));
}

export const contramap = <A, B>(f: (a: B) => A) => (compareA: Compare<A>) => compareA.contramap(f);
export const concat = <A>(compareA1: Compare<A>) => (compareA2: Compare<A>) => compareA1.concat(compareA2);
export const empty = <A>() => Compare.empty<A>();
export const pred: Contravariant1<URI> & Monoid1<URI> = {
    contramap,
    empty,
    concat,
};
