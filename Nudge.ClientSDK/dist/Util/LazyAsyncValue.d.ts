import { Lazy } from "./fp/function";
export default class LazyAsyncValue<V> {
    private readonly producer;
    private produced;
    private value?;
    static of: <V_1>(a: () => Promise<V_1>) => Lazy<Promise<V_1>>;
    constructor(producer: () => Promise<V>);
    getValue: () => Promise<V>;
}
