import { CompareResult } from "~/Util/sortUtils";

/**
 * Types and Type Aliases
 */
export type Predicate<A> = (a: A) => boolean
export type Lazy<A> = () => A;
export type Comparator<A> = (a: A, b: A) => CompareResult;


/**
 * Functions
 */
export const noop = () => {};
export const id = <A>(a: A): A => a;
export const constant = <A>(a: A) => () => a;

export const isNotNull = <A>(a: A): a is NonNullable<A> => (a != null);
export const once = (f: (...args: any[]) => any) => {
    let called = false;
    return (...args: any[]) => {
        if (called) return;
        f.apply(null, args);
        called = true;
    };
}
export const not = <A>(f: (a: A) => boolean) => (a: A) => !f(a);

export const allPass = <A>(fs: (Predicate<A>)[] = []) => (a: A) => fs.length > 0 && fs.every(f => f(a));
export const anyPass = <A>(fs: (Predicate<A>)[] = []) => (a: A) => fs.some(f => f(a));

export function compose<A extends unknown[], B>(ab: (...a: A) => B): (...a: A) => B;
export function compose<A extends unknown[], B, C>(bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => C;
export function compose<A extends unknown[], B, C, D>(
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => D;
export function compose<A extends unknown[], B, C, D, E>(
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => E;
export function compose<A extends unknown[], B, C, D, E, F>(
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => F;
export function compose<A extends unknown[], B, C, D, E, F, G>(
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => G;
export function compose<A extends unknown[], B, C, D, E, F, G, H>(
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => H;
export function compose<A extends unknown[], B, C, D, E, F, G, H, I>(
    hi: (h: H) => I,
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => I;
export function compose<A extends unknown[], B, C, D, E, F, G, H, I, J>(
    ij: (i: I) => J,
    hi: (h: H) => I,
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => J;
export function compose<A extends unknown[], B, C, D, E, F, G, H, I, J, K>(
    jk: (j: J) => K,
    ij: (i: I) => J,
    hi: (h: H) => I,
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (...a: A) => B
): (...a: A) => K;
export function compose<A extends unknown[]>(...fns: Function[]) {
    return fns.reduce((f, g) => (...args: A) => f(g(...args)));
}

export function pipe<A extends unknown[], B>(ab: (...a: A) => B): (...a: A) => B
export function pipe<A extends unknown[], B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C
export function pipe<A extends unknown[], B, C, D>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
): (...a: A) => D
export function pipe<A extends unknown[], B, C, D, E>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
): (...a: A) => E
export function pipe<A extends unknown[], B, C, D, E, F>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
): (...a: A) => F
export function pipe<A extends unknown[], B, C, D, E, F, G>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
): (...a: A) => G
export function pipe<A extends unknown[], B, C, D, E, F, G, H>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
): (...a: A) => H
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
): (...a: A) => I
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
): (...a: A) => J
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K>(
    ab: (...a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
): (...a: A) => K
export function pipe<A extends unknown[], B>(f1: (...a: A) => B, ...fns: Function[]) {
    return (...args: A) => fns.reduce((v, f) => f(v), f1(...args));
}
