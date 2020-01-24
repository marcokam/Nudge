import { HKT, URIS, Type } from "../HKT";

export interface Semigroup<F> {
    readonly concat: <A>(fa1: HKT<F, A>) => (fa2: HKT<F, A>) => HKT<F, A>;
}

export interface Semigroup1<F extends URIS> {
    readonly concat: <A>(fa1: Type<F, A>) => (fa2: Type<F, A>) => Type<F, A>;
}
