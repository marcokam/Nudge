import { HKT, URIS, URIS2, Type, Type2 } from "../HKT";

export interface Contravariant<F> {
    readonly contramap: <A, B>(f: (b: B) => A) => (fa: HKT<F, A>) => HKT<F, B>;
}

export interface Contravariant1<F extends URIS> {
    readonly contramap: <A, B>(f: (b: B) => A) => (fa: Type<F, A>) => Type<F, B>;
}

export interface Contravariant2<F extends URIS2> {
    readonly contramap: <A, B, C>(f: (c: C) => A) => (fab: Type2<F, A, B>) => Type2<F, C, B>;
}
