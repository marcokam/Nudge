import { URIS, URIS2, Type, Type2 } from "../HKT";
import { Monad1 }from "../Algebras/Monad";
import { Monoid1 } from "../Algebras/Monoid";
import { Applicative1, Applicative2 } from "../Algebras/Applicative";
import { Predicate } from "../function";
import { uniq, uniqBy, isEmpty, optHead, optFind, flatten, groupBy } from "../array";
import { option } from "./Option";

export const URI = "List";
export type URI = typeof URI;

type Return<A> = A extends (...args: any[]) => infer R ? R : never;


export class List<A> {
    readonly tag: "List" = "List";
    private readonly value: A[];
    static of = <A>(...a: A[]): List<A> => new List(a);
    static empty = <A>() => new List([]) as unknown as List<A>;
    static fromArray = <A>(a: A[]): List<A> => List.of(...a);
    
    constructor(a: A[]) {
        this.value = a;
    }
    
    readonly map = <B>(f: (a: A) => B): List<B> => new List(this.value.map(f));
    readonly ap = <B>(ListB: List<B>): List<Return<A>> =>
        new List(flatten(ListB.value
            .map(b => (this.value as unknown as ((b: B) => Return<A>)[])
                .map(f => f(b)))))
    readonly chain = <B>(f: (a: A) => List<B>): List<B> =>
        new List(flatten(this.value.map(a => f(a).value)));
    readonly filter = (p: (a: A) => boolean): List<A> =>
        new List(this.value.filter(p));
    readonly concat = (listA: List<A>): List<A> => new List(this.value.concat(listA.value));
    readonly fold = <B>(f: (acc: B, a: A) => B, seed: B): B => this.value.reduce(f, seed);
    readonly traverse1 = <F extends URIS, B>(F: Applicative1<F>, f: (a: A) => Type<F, B>) =>
        this.value.reduce((acc, a) => F.ap(
            F.map((listB: List<B>) => (b: B) => listB.concat(List.of(b)))(acc))
        (f(a)), F.of<List<B>>(List.empty()));
    readonly traverse2 = <F extends URIS2, E, B>(F: Applicative2<F>, f: (a: A) => Type2<F, E, B>) =>
        this.value.reduce((acc, a) => F.ap(
            F.map<E, List<B>, (b: B) => List<B>>((listB: List<B>) => (b: B) => listB.concat(List.of(b)))(acc))
        (f(a)), F.of<E, List<B>>(List.empty()));
    
    readonly toArray = () => this.value;
    readonly isEmpty = () => isEmpty(this.value);
    readonly length = () => this.value.length;
    readonly reverse = () => new List(this.value.reverse());
    readonly groupBy = (f: (a: A) => string) => groupBy(f)(this.value);
    readonly uniq = () => new List(uniq(this.value));
    readonly uniqBy = <B>(f: (a: A) => B) => new List(uniqBy(f)(this.value));
    readonly optHead = () => optHead(this.value);
    readonly optFind = (f: Predicate<A>) => optFind(f)(this.value);
    readonly optLast = () => option.of(this.value.length > 0 && this.value[this.value.length - 1]);
}

export const map = <A, B>(f: (a: A) => B) => (listA: List<A>) => listA.map(f);
export const ap = <A, B>(listAtoB: List<(a: A) => B>) => (listA: List<A>): List<B> => listAtoB.ap(listA);
export const chain = <A, B>(f: (a: A) => List<B>) => (listA: List<A>) => listA.chain(f);
export const of = <A>(...a: A[]) => List.of<A>(...a);
export const concat = <A>(listA1: List<A>) => (listA2: List<A>) => listA1.concat(listA2);
export const empty = <A>() => List.empty<A>();
export const list: Monad1<URI> & Monoid1<URI> = {
    map,
    ap,
    chain,
    of,
    empty,
    concat,
};

