import CustomError from "./CustomError";
export default class AggregateError extends CustomError {
    readonly errors: any[];
    constructor(errors: any[]);
}
