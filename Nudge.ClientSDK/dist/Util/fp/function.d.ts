import { CompareResult } from "../sortUtils";
/**
 * Types and Type Aliases
 */
export declare type Predicate<A> = (a: A) => boolean;
export declare type Lazy<A> = () => A;
export declare type Comparator<A> = (a: A, b: A) => CompareResult;
/**
 * Functions
 */
export declare const noop: () => void;
export declare const id: <A>(a: A) => A;
export declare const constant: <A>(a: A) => () => A;
export declare const isNotNull: <A>(a: A) => a is NonNullable<A>;
export declare const once: (f: (...args: any[]) => any) => (...args: any[]) => void;
export declare const not: <A>(f: (a: A) => boolean) => (a: A) => boolean;
export declare const allPass: <A>(fs?: Predicate<A>[]) => (a: A) => boolean;
export declare const anyPass: <A>(fs?: Predicate<A>[]) => (a: A) => boolean;
export declare function compose<A extends unknown[], B>(ab: (...a: A) => B): (...a: A) => B;
export declare function compose<A extends unknown[], B, C>(bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => C;
export declare function compose<A extends unknown[], B, C, D>(cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => D;
export declare function compose<A extends unknown[], B, C, D, E>(de: (d: D) => E, cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => E;
export declare function compose<A extends unknown[], B, C, D, E, F>(ef: (e: E) => F, de: (d: D) => E, cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => F;
export declare function compose<A extends unknown[], B, C, D, E, F, G>(fg: (f: F) => G, ef: (e: E) => F, de: (d: D) => E, cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => G;
export declare function compose<A extends unknown[], B, C, D, E, F, G, H>(gh: (g: G) => H, fg: (f: F) => G, ef: (e: E) => F, de: (d: D) => E, cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => H;
export declare function compose<A extends unknown[], B, C, D, E, F, G, H, I>(hi: (h: H) => I, gh: (g: G) => H, fg: (f: F) => G, ef: (e: E) => F, de: (d: D) => E, cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => I;
export declare function compose<A extends unknown[], B, C, D, E, F, G, H, I, J>(ij: (i: I) => J, hi: (h: H) => I, gh: (g: G) => H, fg: (f: F) => G, ef: (e: E) => F, de: (d: D) => E, cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => J;
export declare function compose<A extends unknown[], B, C, D, E, F, G, H, I, J, K>(jk: (j: J) => K, ij: (i: I) => J, hi: (h: H) => I, gh: (g: G) => H, fg: (f: F) => G, ef: (e: E) => F, de: (d: D) => E, cd: (c: C) => D, bc: (b: B) => C, ab: (...a: A) => B): (...a: A) => K;
export declare function pipe<A extends unknown[], B>(ab: (...a: A) => B): (...a: A) => B;
export declare function pipe<A extends unknown[], B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C;
export declare function pipe<A extends unknown[], B, C, D>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (...a: A) => D;
export declare function pipe<A extends unknown[], B, C, D, E>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E): (...a: A) => E;
export declare function pipe<A extends unknown[], B, C, D, E, F>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F): (...a: A) => F;
export declare function pipe<A extends unknown[], B, C, D, E, F, G>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G): (...a: A) => G;
export declare function pipe<A extends unknown[], B, C, D, E, F, G, H>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H): (...a: A) => H;
export declare function pipe<A extends unknown[], B, C, D, E, F, G, H, I>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I): (...a: A) => I;
export declare function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J): (...a: A) => J;
export declare function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J, K>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K): (...a: A) => K;
