import { Lazy, id } from "../function";
import { Monad2 }from "../Algebras/Monad";
import { Either, either, left } from "./Either";
import { Option } from "./Option";
import Producer, { toResult, valueToPromise } from "./Producer";
import { throwError } from "../error";

export const URI = "Task";
export type URI = typeof URI;

type Return<A> = A extends (...args: any[]) => infer R ? R : never;

export type Result<T> = Task<Error, T>;
export class Task<E, A> {
    readonly tag: "Task" = "Task";
    static ofValue = <A>(a: A): Task<never, A> => new Task<never, A>(() => Promise.resolve(a));
    static of = <E, A>(a: A | Promise<A>): Task<E, A> => new Task(() => valueToPromise(a));
    static fromProducer = <A>(p: Producer<A>) => toResult(p);
    static fromEither = <E, A>(either: Either<E, A>) => new Task(() => Promise.resolve(either.getOrElse(id)));
    static fromOption = <E, A>(option: Option<A>, defaultValue: A) => new Task(() => Promise.resolve(option.getOrElse(() => defaultValue)));
    static reject = <E, A>(e: string): Task<E, A> => new Task(() => Promise.reject(new Error(e)));
    static toPromise = <E extends Error, A>(t: Task<E, A>) => t.fork(throwError, id);
    
    readonly run: Lazy<Promise<Either<E, A>>>

    constructor(run: Lazy<Promise<A>>) {
        this.run = () => run()
            .then(either.of)
            .catch(left) as unknown as Promise<Either<E, A>>;
    }
    
    readonly map = <B>(f: (a: A) => B): Task<E, B> => new Task(() =>
        this.run()
            .then(either.map(f))
            .then(eitherB => eitherB.fold(id, id))
    );

    readonly ap = <B>(Tb: Task<E, B>): Task<E, Return<A>> => new Task(() =>
        Promise.all([this.run(), Tb.run()])
            .then(([eitherFunc, eitherB]) => eitherFunc.ap(eitherB))
            .then(eitherB => eitherB.fold(id, id))
    );

    readonly chain = <B>(f: (a: A) => Task<E, B>): Task<E, B> => new Task(() =>
        this.run()
            .then(either.map(f))
            .then(eitherTaskB => eitherTaskB.fold(
                id, taskB => taskB.fork(id, id)
            ))
    )

    readonly fork = <E2, A2>(onError: (e: E) => E2, onSuccess: (a: A) => A2): Promise<E2 | A2> =>
        this.run()
            .then(eitherA => eitherA.fold(onError, onSuccess))
            .catch(onError);
}

export const map = <E, A, B>(f: (a: A) => B) => (taskA: Task<E, A>) => taskA.map(f);
export const ap = <E, A, B>(taskAtoB: Task<E, (a: A) => B>) => (taskA: Task<E, A>): Task<E, B> => taskAtoB.ap(taskA);
export const chain = <E, A, B>(f: (a: A) => Task<E, B>) => (taskA: Task<E, A>) => taskA.chain(f);
export const of = <E, A>(a: A | Promise<A>) => Task.of<E, A>(a);
export const task: Monad2<URI> = {
    map,
    ap,
    chain,
    of,
};
