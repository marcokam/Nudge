import { URI2HKT, URI2HKT2 } from "./Instances/URI2HKT";

export interface HKT<URI, A> {
    _URI: URI;
    _A: A;
}
export type URIS = keyof URI2HKT<any>
export type Type<URI extends URIS, A> = URI2HKT<A>[URI]

export interface HKT2<URI, E, A> extends HKT<URI, A> {
    _E: E;
}
export type URIS2 = keyof URI2HKT2<any, any>
export type Type2<URI extends URIS2, E, A> = URI2HKT2<E, A>[URI]