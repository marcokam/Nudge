import { URIS2, Type2, HKT2 } from "../HKT";
import { Functor, Functor2 } from "./Functor";
export interface Bifunctor<F> extends Functor<F> {
    readonly bimap: <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) => (pab: HKT2<F, A, B>) => HKT2<F, C, D>;
}
export interface Bifunctor2<F extends URIS2> extends Functor2<F> {
    readonly bimap: <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) => (pab: Type2<F, A, B>) => Type2<F, C, D>;
}
