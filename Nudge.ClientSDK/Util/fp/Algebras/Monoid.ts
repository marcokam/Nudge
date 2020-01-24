import { HKT, URIS, Type } from "../HKT";
import { Semigroup, Semigroup1 } from "./Semigroup";

export interface Monoid<F> extends Semigroup<F> {
    readonly empty: <A>(fa: HKT<F, A>) => HKT<F, A>;
}

export interface Monoid1<F extends URIS> extends Semigroup1<F> {
    readonly empty: <A>(fa: Type<F, A>) => Type<F, A>;
}
