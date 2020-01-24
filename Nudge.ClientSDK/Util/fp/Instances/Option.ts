import { Lazy, isNotNull } from "../function";
import { Monad1 } from "../Algebras/Monad";
import { URIS, Type, URIS2, Type2 } from "../HKT";
import { Applicative1, Applicative2 } from "../Algebras/Applicative";

export const URI = "Option";
export type URI = typeof URI;

type Return<A> = A extends (...args: any[]) => infer R ? R : never;


export class None<A> {
    private readonly tag: "None" = "None";
    readonly map = <B>(f: (a: A) => B): Option<B> => this as unknown as Option<never>;              // eslint-disable-line @typescript-eslint/no-unused-vars
    readonly ap = <B>(Ob: Option<B>): Option<Return<A>> => this as unknown as Option<never>;        // eslint-disable-line @typescript-eslint/no-unused-vars
    readonly chain = <B>(f: (a: A) => Option<B>): Option<B> => this as unknown as Option<never>;    // eslint-disable-line @typescript-eslint/no-unused-vars
    readonly traverse1 = <F extends URIS, B>(F: Applicative1<F>, f: (a: A) => Type<F, B>): Type<F, Option<B>> => // eslint-disable-line @typescript-eslint/no-unused-vars
        F.of(this) as unknown as Type<F, Option<B>>;
    readonly traverse2 = <F extends URIS2, E, B>(F: Applicative2<F>, f: (a: A) => Type2<F, E, B>): Type2<F, E, Option<B>> => // eslint-disable-line @typescript-eslint/no-unused-vars
        F.of(this) as unknown as Type2<F, E, Option<B>>;
    readonly getOrElse = <D>(f: Lazy<D>): A | D => f();
}
export const none: Option<never> = new None();
export class Some<A> {
    private readonly tag: "Some" = "Some";
    private readonly value: A
    constructor(value: A) {
        this.value = value;
    }
    readonly map = <B>(f: (a: A) => B): Option<B> => isNotNull(f(this.value)) ? new Some(f(this.value)) as Some<NonNullable<B>> : none;
    readonly ap = <B>(Ob: Option<B>) => Ob.map((this.value as unknown as (b: B) => Return<A>));
    readonly chain = <B>(f: (a: A) => Option<B>) => f(this.value);
    readonly traverse1 = <F extends URIS, B>(F: Applicative1<F>, f: (a: A) => Type<F, B>): Type<F, Option<B>> =>
        F.ap(F.of((b: B) => new Some(b)))(f(this.value)) as unknown as Type<F, Option<B>>
    readonly traverse2 = <F extends URIS2, E, B>(F: Applicative2<F>, f: (a: A) => Type2<F, E, B>): Type2<F, E, Option<B>> =>
        F.ap<E, B, Some<B>>(F.of((b: B) => new Some(b)))(f(this.value)) as unknown as Type2<F, E, Option<B>>
    readonly getOrElse = <D>(f: Lazy<D>): A | D => this.value;                                      // eslint-disable-line @typescript-eslint/no-unused-vars
}
export const some = <A>(a: A) => new Some(a);
export type Option<A> =  Some<NonNullable<A>> | None<NonNullable<A>>;


export const map = <A, B>(f: (a: A) => B) => (Oa: Option<A>) => Oa.map(f);
export const ap = <A, B>(Oab: Option<(a: A) => B>) => (Oa: Option<A>) => Oab.ap(Oa);
export const chain = <A, B>(f: (a: A) => Option<B>) => (Oa: Option<A>) => Oa.chain(f);
export const of = <A>(a: A): Option<A> => isNotNull(a) ? some(a) : none;
export const option: Monad1<URI> = {
    map,
    ap,
    chain,
    of,
};

export const tryCatch = <A>(f: Lazy<A>) => {
    try {
        return option.of(f());
    } catch (err) {
        return none;
    }
}
