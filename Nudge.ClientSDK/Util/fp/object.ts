import { option } from "./Instances/Option";
import { Pair } from "./Instances/Pair";
import { compose } from "./function";

export const keys = <A>(obj: A) => Object.keys(obj) as (keyof A)[];
export const values = <A>(obj: A) => Object.values(obj) as A[keyof A][];
export const entries = <A>(obj: A) => Object.entries(obj) as [keyof A, A[keyof A]][];
export const fromEntries = <A extends string | number | symbol, B>(entries: [A, B][]): Record<A, B> => Object.fromEntries
    ? Object.fromEntries(entries) as unknown as Record<A, B>
    : entries.reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
    }, {} as unknown as Record<A, B>);
export const mapEntries = <A, B>(f: (k: string, v: A) => B) => (obj: Record<string, A>) => entries(obj).map(([k, v]) => f(k, v));
export const map = <A, B>(f: (k: string, v: A) => B) => (obj: Record<string, A>) => compose(fromEntries, mapEntries<A, [string, B]>((k, v) => [k, f(k, v)]))(obj);
export const reduce = <A, B>(f: (acc: B, kv: [string, A], i: number, arr: [string, A][]) => B, init: B) => (obj: Record<string, A>) => entries(obj).reduce(f, init);
export const optProp = <A extends Record<string,any>, P extends Extract<keyof A, string>>(prop: P) => (a: A) => option.of(a[prop]);
export const propOr = <A extends Record<string,any>, B, P extends Extract<keyof A, string>>(prop: P, defaultValue: B) => (a: A) => optProp(prop)(a).getOrElse(() => defaultValue);
export const pick = <A extends Record<string,any>>(props: string[]) => (a: A) => props.reduce((acc, p) => Object.assign(acc, { [p]: a[p] }), {});
export const toPairs = <A>(a: Record<string, A>) => mapEntries((k, v: A) => Pair.of(k, v))(a);
export const fromPairs = <A>(ps: Pair<string, A>[]) => ps.reduce((acc, p) => Object.assign(acc, { [p.fst()]: p.snd() }), {} as unknown as Record<string, A>);
