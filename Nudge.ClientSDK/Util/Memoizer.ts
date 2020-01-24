import { AreEqual } from "~/Comparison/ComparisonInterfaces";
import * as AreEquals from "~/Comparison/AreEquals";

export type ValueProducer<In, Out> = (input: In) => Out;
export interface Memoizer<In, Out> {
    computeValue: ValueProducer<In, Out>;
}

// Memoizes only a single value at once.
// If input changes, old value is discarded.
export class SingleValueMemoizer<In, Out> implements Memoizer<In, Out> {
    
    private readonly producer: ValueProducer<In, Out>;
    private readonly inputsAreEqual: AreEqual<In>;
    private input: In | undefined;
    private output: Out | undefined;

    constructor(producer: ValueProducer<In, Out>, inputsAreEqual: AreEqual<In>) {
        this.producer = producer;
        this.inputsAreEqual = inputsAreEqual || AreEquals.strictEquals;
    }

    computeValue = (input: In): Out => {
        if (this.output === undefined || this.input === undefined || !this.inputsAreEqual(input, this.input)) {
            const result = this.producer(input);
            this.input = input;
            this.output = result;
            return result;
        }
        return this.output;
    }
}