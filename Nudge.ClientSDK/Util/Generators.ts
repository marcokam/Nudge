export type Generator<T> = Iterator<T>;
export type GeneratorProducer<T> = () => Generator<T>;