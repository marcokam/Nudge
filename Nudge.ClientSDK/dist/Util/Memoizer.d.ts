import { AreEqual } from "../Comparison/ComparisonInterfaces";
export declare type ValueProducer<In, Out> = (input: In) => Out;
export interface Memoizer<In, Out> {
    computeValue: ValueProducer<In, Out>;
}
export declare class SingleValueMemoizer<In, Out> implements Memoizer<In, Out> {
    private readonly producer;
    private readonly inputsAreEqual;
    private input;
    private output;
    constructor(producer: ValueProducer<In, Out>, inputsAreEqual: AreEqual<In>);
    computeValue: (input: In) => Out;
}
