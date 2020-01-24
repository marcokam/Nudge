export default class LazyMap<TKey, TValue> {
    private readonly producer: (key: TKey) => TValue;
    readonly values: Map<TKey, TValue> = new Map();
    constructor(producer: (key: TKey) => TValue) {
        this.producer = producer;
    }
    getValue = (key: TKey): TValue => {
        const fromMap = this.values.get(key);
        if (typeof(fromMap) !== "undefined") {
            return fromMap;
        }
        const newValue = this.producer(key);
        this.values.set(key, newValue);
        return newValue;
    }
}