import { Task } from "./Task";
import { isFunction } from "../../utils";
import LazyValue from "../../LazyValue";
var isValueProducer = function (p) { return isFunction(p); };
export var valueToPromise = function (v) { return v instanceof Promise ? v : v instanceof Task ? Task.toPromise(v) : Promise.resolve(v); };
// Execution is not deferred.  Do NOT export this.  
var toPromise = function (p) {
    if (!isValueProducer(p)) {
        return valueToPromise(p);
    }
    return valueToPromise(p());
};
// Flatten a Producer to a lazy Promise.  The result of invoking Producer is cached, therefore the provided Producer will only be invoked once.
// Execution is deferred until the resulting function is called.
export var toLazyPromise = function (p) { return new LazyValue(function () { return toPromise(p); }).getValue; };
// Flatten a Producer to a Result.  The result of invoking Producer is not cached, therefore the provided Producer could be invoked multiple times.
// Execution is deferred until the resulting Task is forked.
export var toResult = function (p) { return new Task(function () { return toPromise(p); }); };
// Flatten a Producer to a Result.  The result of invoking Producer is cached, therefore the provided Producer will only be invoked once.
// Execution is deferred until the resulting Task is forked.
export var toCachedResult = function (p) { return new Task(toLazyPromise(p)); };
//# sourceMappingURL=Producer.js.map