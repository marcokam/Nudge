import { HKT, URIS, URIS2, Type, Type2 } from "../HKT";
import { Apply, Apply1, Apply2 } from "./Apply";

export interface Chain<F> extends Apply<F> {
    readonly chain: <A, B>(f: (a: A) => HKT<F, B>) => (fa: HKT<F, A>) => HKT<F, B>;
}

export interface Chain1<F extends URIS> extends Apply1<F> {
    readonly chain: <A, B>(f: (a: A) => Type<F, B>) => (fa: Type<F, A>) => Type<F, B>;
}

export interface Chain2<F extends URIS2> extends Apply2<F> {
    readonly chain: <E, A, B>(f: (a: A) => Type2<F, E, B>) => (fa: Type2<F, E, A>) => Type2<F, E, B>;
}
