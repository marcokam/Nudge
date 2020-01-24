import { Predicate, Comparator, compose, id } from "./function";
import { tryCatch, option } from "./Instances/Option";
import { Applicative1, Applicative2 } from "./Algebras/Applicative";
import { Type, URIS, URIS2, Type2 } from "./HKT";

/**
 * Array utils
 */
export const reverse = <A>(as: A[]) => as.reverse();
export const sort = <A>(f: Comparator<A>) => (as: A[]) => as.sort(f);
export const every = <A>(f: Predicate<A>) => (as: A[] = []) => as.every(f);
export const some = <A>(f: Predicate<A>) => (as: A[] = []) => as.some(f);
export const filter = <A>(f: Predicate<A>) => (as: A[] = []) => as.filter(f);
export const filterUndef = <T>(ts: (T | undefined)[]): T[] => ts.filter((t: T | undefined): t is T => !!t);
export const map = <A, B>(f: (a: A) => B) => (as: A[] = []) => as.map(f);
export const reduce = <A, B>(f: (acc: B, v: A) => B, init: B) => (as: A[] = []) => as.reduce(f, init);
export const flatten = <A>(a: A[][]): A[] => {
    if ("flatMap" in Array.prototype) return a.flatMap(id);
    let result: A[] = [];
    for (let arr of a) {
        result = result.concat(arr);
    }
    return result;
}


export const groupBy = <A>(f: (a: A) => string) => (as: A[] = []) => reduce<A, { [k: string]: A[] }>((acc, v) => {
    const [nextK, oldV = []] = [f(v), acc[f(v)]];
    acc[nextK] = oldV.concat(v);
    return acc;
}, {})(as);
export const uniq = <A>(as: A[] = []) => as.length === 0 ? as : Array.from(new Set(as));
export const uniqBy = <A, B>(f: (a: A) => B) => (as: A[] = []) => as.length === 0 ? as : compose(
    map<[B, A], A>(([_, a]) => a),
    kvs => Array.from(new Map(kvs)),
    map<A, [B, A]>(a => [f(a), a]),
)(as);

export const optHead = <A>(as: A[] = []) => tryCatch(() => as[0]);
export const head = <A>(as: A[] = []) => optHead(as).getOrElse(() => undefined);
export const tail = <A>(as: A[] = []) => as.slice(1);
export const optLast = <A>(as: A[] = []) => tryCatch(() => as[as.length - 1]);
export const last = <A>(as: A[] = []) => optLast(as).getOrElse(() => undefined);
export const range = (a: number, b?: number) => b ? [...Array(b - a).keys()].map(n => n + a) : [...Array(a).keys()];
export const isEmpty = <A>(as: A[]) => as.length === 0;
export const optFind = <A>(f: Predicate<A>) => (as: A[]) => option.of(as.find(f));

export const empty = [];
export const traverse1 = <F extends URIS, A, B>(F: Applicative1<F>) => (f: (a: A) => Type<F, B>) => (as: A[]) =>
    as.reduce((acc, a) => F.ap(F.map((bs: B[]) => (b: B) => bs.concat([b]))(acc))(f(a)), F.of<B[]>(empty));
export const traverse2 = <F extends URIS2, E, A, B>(F: Applicative2<F>) => (f: (a: A) => Type2<F, E, B>) => (as: A[]) =>
    as.reduce((acc, a) => F.ap<E, B, B[]>(F.map<E, B[], (b: B) => B[]>((bs: B[]) => (b: B) => bs.concat([b]))(acc))(f(a)), F.of<E, B[]>(empty));
export const sequence1 = <F extends URIS, A>(F: Applicative1<F>) => traverse1<F, Type<F, A>, A>(F)(id);
export const sequence2 = <F extends URIS2, E, A,>(F: Applicative2<F>) => traverse2<F, E, Type2<F, E, A>, A>(F)(id);

export const splitEvery = <A>(n: number) => (as: A[]) => as.reduce((acc, a) => {
    const lst = last(acc);
    if (lst && lst.length < n) lst.push(a);
    else acc.push([a]);
    return acc;
}, [] as unknown as A[][]);
