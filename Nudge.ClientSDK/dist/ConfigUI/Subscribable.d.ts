export default class Subscribable<T> {
    private currentValue;
    private readonly subscribers;
    constructor(currentValue: T);
    subscribe: (subscribeFn: (value: T) => void) => void;
    getValue: () => T;
    setValue: (newValue: T) => void;
}
