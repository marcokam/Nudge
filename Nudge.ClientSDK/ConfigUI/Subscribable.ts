export default class Subscribable<T> {
    private currentValue: T;
    private readonly subscribers: ((value: T) => void)[] = [];
    constructor(currentValue: T) {
        this.currentValue = currentValue;
    }

    subscribe = (subscribeFn: (value: T) => void): void => {
        this.subscribers.push(subscribeFn);
    }

    getValue = (): T => this.currentValue;
    setValue = (newValue: T) => {
        const oldValue = this.currentValue;
        this.currentValue = newValue;
        if (oldValue !== newValue) {
            this.subscribers.forEach(subscriber => subscriber(newValue));
        }
    }
}