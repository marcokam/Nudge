import { HKT, URIS, URIS2, Type, Type2 } from "../HKT";
/**
 * Functors have to obey 2 laws:
 *
 * 1. Identity: F.map(id) = F
 * 2. Composition: F.map(compose(bc, ab)) == F.map(ab).map(bc)
 */
export interface Functor<F> {
    readonly map: <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>;
}
export interface Functor1<F extends URIS> {
    readonly map: <A, B>(f: (a: A) => B) => (fa: Type<F, A>) => Type<F, B>;
}
export interface Functor2<F extends URIS2> {
    readonly map: <E, A, B>(f: (a: A) => B) => (fa: Type2<F, E, A>) => Type2<F, E, B>;
}
