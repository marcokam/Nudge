import { Monoid1 } from "../Algebras/Monoid";
import { Contravariant1 } from "../Algebras/Contravariant";
import { Predicate } from "../function";

export const URI = "Pred";
export type URI = typeof URI;
 
export class Pred<A> {
    readonly tag: "Pred" = "Pred";
    private readonly value: Predicate<A>;
    static of = <A>(a: Predicate<A>): Pred<A> => new Pred(a);
    static empty = <A>() => new Pred(() => true) as unknown as Pred<A>;
    static not = <A>(p: Pred<A>) => new Pred((a: A) => !p.run(a));

    constructor(a: Predicate<A>) {
        this.value = a;
    }
    
    readonly run = (a: A) => this.value(a);
    readonly contramap = <B>(f: (b: B) => A): Pred<B> => new Pred((b: B ) => this.run(f(b)));
    readonly concat = (predA: Pred<A>): Pred<A> => new Pred((a: A) => this.run(a) && predA.run(a));
    readonly concatOr = (predA: Pred<A>): Pred<A> => new Pred((a: A) => this.run(a) || predA.run(a));
}

export const contramap = <A, B>(f: (b: B) => A) => (predA: Pred<A>) => predA.contramap(f);
export const concat = <A>(predA1: Pred<A>) => (predA2: Pred<A>) => predA1.concat(predA2);
export const empty = <A>() => Pred.empty<A>();
export const pred: Contravariant1<URI> & Monoid1<URI> = {
    contramap,
    empty,
    concat,
};
