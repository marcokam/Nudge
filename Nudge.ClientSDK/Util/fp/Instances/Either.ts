import { Lazy } from "../function";
import { Monad2 } from "../Algebras/Monad";

export const URI = "Either";
export type URI = typeof URI;

type Return<A> = A extends (...args: any[]) => infer R ? R : never;

export class Left<E, A> {
    private readonly tag: "Left" = "Left";
    readonly right: never;
    readonly left: E;
    constructor(left: E) {
        this.left = left;
    }
    readonly map = <B>(f: (a: A) => B): Either<E, B> =>                 // eslint-disable-line @typescript-eslint/no-unused-vars
        this as unknown as Either<E, B>;
    readonly ap = <B>(Eb: Either<E, B>): Either<E, Return<A>> =>        // eslint-disable-line @typescript-eslint/no-unused-vars
        this as unknown as Either<E, Return<A>>;
    readonly chain = <B>(f: (a: A) => Either<E, B>): Either<E, B> =>    // eslint-disable-line @typescript-eslint/no-unused-vars
        this as unknown as Either<E, never>;
    readonly getOrElse = <D>(f: (e: E) => D) =>
        f(this.left);
    readonly fold = (l: (e: E) => any, r: (a: A) => any) =>         // eslint-disable-line @typescript-eslint/no-unused-vars
        l(this.left);
}
export const left = <E = never, A = never>(e: E): Either<E, never> => new Left(e) as Either<E, never>;

export class Right<E, A> {
    private readonly tag: "Right" = "Right";
    readonly right: A;
    readonly left: never;
    constructor(right: A) {
        this.right = right;
    }
    readonly map = <B>(f: (a: A) => B): Either<E, B> => {
        try {
            return new Right(f(this.right));
        } catch (e) {
            return left(e);
        }
    }
    readonly ap = <B>(eitherB: Either<E, B>): Either<E, Return<A>> =>
        eitherB.map((this.right as unknown as (b: B) => Return<A>));
    readonly chain = <B>(f: (a: A) => Either<E, B>): Either<E, B> =>
        f(this.right);
    readonly getOrElse = (e?: any) =>   // eslint-disable-line @typescript-eslint/no-unused-vars
        this.right;
    readonly fold = (l: (e: E) => any, r: (a: A) => any) =>
        r(this.right);
}
export type Either<E, A> = Left<E, A> | Right<E, A>;

export const right = <E, A>(a: A): Either<E, A> => new Right(a);
export const map = <E, A, B>(f: (a: A) => B) => (eitherA: Either<E, A>): Either<E, B> => eitherA.map(f);
export const ap = <E, A, B>(eitherAToB: Either<E, (a: A) => B>) => (eitherA: Either<E, A>): Either<E, B> => eitherAToB.ap(eitherA);
export const chain = <E, A, B>(f: (a: A) => Either<E, B>) => (eitherA: Either<E, A>) => eitherA.chain(f);
export const of = <E, A>(a: A): Either<E, A> => !(a instanceof Error) ? right(a) : left(a) as unknown as Either<E, A>;
export const either: Monad2<URI> = {
    map,
    ap,
    chain,
    of,
};

export const tryCatch = <E, A>(f: Lazy<A>): Either<E, A> => {
    try {
        return either.of(f()) as unknown as Either<E, A>;
    } catch (e) {
        return left(e);
    }
}
