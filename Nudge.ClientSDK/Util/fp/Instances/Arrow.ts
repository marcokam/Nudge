import { Contravariant2 } from "../Algebras/Contravariant";
import { Functor2 } from "../Algebras/Functor";

const URI = "Arrow";
export type URI = typeof URI;
 
export class Arrow<A, B> {
    readonly tag: "Arrow" = "Arrow";
    private readonly value: (a: A) => B;
    static of = <A, B>(f: (a: A) => B): Arrow<A, B> => new Arrow(f);

    constructor(f: (a: A) => B) {
        this.value = f;
    }
    
    readonly run = (a: A) => this.value(a);
    readonly map = <C>(f: (b: B) => C) => new Arrow((a: A) => f(this.run(a)));
    readonly contramap = <C>(f: (c: C) => A) => new Arrow((c: C) => this.run(f(c)));
}

export const map = <A, B, C>(f: (b: B) => C) => (arrowAB: Arrow<A, B>) => arrowAB.map(f);
export const contramap = <A, B, C>(f: (c: C) => A) => (arrowAB: Arrow<A, B>) => arrowAB.contramap(f);
export const of = <A, B>(f: (a: A) => B) => new Arrow(f);
export const arrow: Contravariant2<URI> & Functor2<URI> = {
    map,
    contramap,
};
