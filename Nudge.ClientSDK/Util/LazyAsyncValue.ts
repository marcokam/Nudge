import { Lazy } from "./fp/function";

export default class LazyAsyncValue<V> {
    private readonly producer: () => Promise<V>;
    private produced: boolean = false;
    private value?: Promise<V>;

    static of = <V>(a: () => Promise<V>): Lazy<Promise<V>> => new LazyAsyncValue(a).getValue;

    constructor(producer: () => Promise<V>) {
        this.producer = producer;
    }

    getValue = (): Promise<V> => {
        if (this.produced) {
            return this.value as Promise<V>; // Cast to remove undefined 
        }
        this.value = this.producer();
        this.produced = true;
        return this.value;
    };
}
