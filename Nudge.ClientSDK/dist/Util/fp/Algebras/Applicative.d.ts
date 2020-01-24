import { HKT, URIS, URIS2, Type, Type2 } from "../HKT";
import { Apply, Apply1, Apply2 } from "../Algebras/Apply";
export interface Applicative<F> extends Apply<F> {
    readonly of: <A>(a: A) => HKT<F, A>;
}
export interface Applicative1<F extends URIS> extends Apply1<F> {
    readonly of: <A>(a: A) => Type<F, A>;
}
export interface Applicative2<F extends URIS2> extends Apply2<F> {
    readonly of: <E, A>(a: A, e?: E) => Type2<F, E, A>;
}
