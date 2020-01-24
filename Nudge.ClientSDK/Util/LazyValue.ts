import { Lazy } from "./fp/function";

export default class LazyValue<T> {
    private readonly producer: () => T;
    private produced: boolean = false;
    private value?: T;

    static of = <A>(a: () => A): Lazy<A> => new LazyValue(a).getValue;

    constructor(producer: () => T) {
        this.producer = producer;
    }

    getValue = (): T => {
        if (this.produced) {
            return this.value as T;
        }
        this.value = this.producer();
        this.produced = true;
        return this.value as T;
    }
}