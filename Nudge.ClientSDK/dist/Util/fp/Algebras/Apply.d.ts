import { HKT, URIS, URIS2, Type, Type2 } from "../HKT";
import { Functor, Functor1, Functor2 } from "./Functor";
export interface Apply<F> extends Functor<F> {
    readonly ap: <A, B>(fab: HKT<F, (a: A) => B>) => (fa: HKT<F, A>) => HKT<F, B>;
}
export interface Apply1<F extends URIS> extends Functor1<F> {
    readonly ap: <A, B>(fab: Type<F, (a: A) => B>) => (fa: Type<F, A>) => Type<F, B>;
}
export interface Apply2<F extends URIS2> extends Functor2<F> {
    readonly ap: <E, A, B>(fab: Type2<F, E, (a: A) => B>) => (fa: Type2<F, E, A>) => Type2<F, E, B>;
}
