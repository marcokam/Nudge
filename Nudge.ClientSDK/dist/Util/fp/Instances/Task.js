var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { id } from "../function";
import { either, left } from "./Either";
import { toResult, valueToPromise } from "./Producer";
import { throwError } from "../error";
export var URI = "Task";
var Task = /** @class */ (function () {
    function Task(run) {
        var _this = this;
        this.tag = "Task";
        this.map = function (f) { return new Task(function () {
            return _this.run()
                .then(either.map(f))
                .then(function (eitherB) { return eitherB.fold(id, id); });
        }); };
        this.ap = function (Tb) { return new Task(function () {
            return Promise.all([_this.run(), Tb.run()])
                .then(function (_a) {
                var _b = __read(_a, 2), eitherFunc = _b[0], eitherB = _b[1];
                return eitherFunc.ap(eitherB);
            })
                .then(function (eitherB) { return eitherB.fold(id, id); });
        }); };
        this.chain = function (f) { return new Task(function () {
            return _this.run()
                .then(either.map(f))
                .then(function (eitherTaskB) { return eitherTaskB.fold(id, function (taskB) { return taskB.fork(id, id); }); });
        }); };
        this.fork = function (onError, onSuccess) {
            return _this.run()
                .then(function (eitherA) { return eitherA.fold(onError, onSuccess); })
                .catch(onError);
        };
        this.run = function () { return run()
            .then(either.of)
            .catch(left); };
    }
    Task.ofValue = function (a) { return new Task(function () { return Promise.resolve(a); }); };
    Task.of = function (a) { return new Task(function () { return valueToPromise(a); }); };
    Task.fromProducer = function (p) { return toResult(p); };
    Task.fromEither = function (either) { return new Task(function () { return Promise.resolve(either.getOrElse(id)); }); };
    Task.fromOption = function (option, defaultValue) { return new Task(function () { return Promise.resolve(option.getOrElse(function () { return defaultValue; })); }); };
    Task.reject = function (e) { return new Task(function () { return Promise.reject(new Error(e)); }); };
    Task.toPromise = function (t) { return t.fork(throwError, id); };
    return Task;
}());
export { Task };
export var map = function (f) { return function (taskA) { return taskA.map(f); }; };
export var ap = function (taskAtoB) { return function (taskA) { return taskAtoB.ap(taskA); }; };
export var chain = function (f) { return function (taskA) { return taskA.chain(f); }; };
export var of = function (a) { return Task.of(a); };
export var task = {
    map: map,
    ap: ap,
    chain: chain,
    of: of,
};
//# sourceMappingURL=Task.js.map