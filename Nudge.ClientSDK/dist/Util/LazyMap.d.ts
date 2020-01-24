export default class LazyMap<TKey, TValue> {
    private readonly producer;
    readonly values: Map<TKey, TValue>;
    constructor(producer: (key: TKey) => TValue);
    getValue: (key: TKey) => TValue;
}
