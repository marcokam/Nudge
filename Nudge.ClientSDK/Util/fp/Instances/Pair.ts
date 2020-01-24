import { Bifunctor2 } from "../Algebras/Bifunctor";

export const URI = "Pair";
export type URI = typeof URI;
 
export class Pair<A, B> {
    readonly tag: "Pair" = "Pair";
    private readonly value: [A, B];
    static of = <A, B>(a: A, b: B): Pair<A, B> => new Pair(a, b);
    
    constructor(a: A, b: B) {
        this.value = [a, b];
    }

    readonly fst = () => this.value[0];
    readonly snd = () => this.value[1];
    readonly toArray = () => this.value;
    readonly merge = <C>(f: (a: A, b: B) => C) => f(this.fst(), this.snd());
    
    readonly map = <C>(f: (b: B) => C): Pair<A, C> => new Pair(this.fst(), f(this.snd()));
    readonly bimap = <C, D>(f: (a: A) => C, g: (b: B) => D) => new Pair(f(this.fst()), g(this.snd()));
}

export const map = <A, B, C>(f: (b: B) => C) => (pairAB: Pair<A, B>) => pairAB.map(f);
export const bimap = <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) => (pairAB: Pair<A, B>) => pairAB.bimap(f, g);
export const pair: Bifunctor2<URI> = {
    map,
    bimap,
};
