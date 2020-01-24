import { Lazy } from "./fp/function";
export default class LazyValue<T> {
    private readonly producer;
    private produced;
    private value?;
    static of: <A>(a: () => A) => Lazy<A>;
    constructor(producer: () => T);
    getValue: () => T;
}
