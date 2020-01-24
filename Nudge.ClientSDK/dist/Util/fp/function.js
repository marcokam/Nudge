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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
/**
 * Functions
 */
export var noop = function () { };
export var id = function (a) { return a; };
export var constant = function (a) { return function () { return a; }; };
export var isNotNull = function (a) { return (a != null); };
export var once = function (f) {
    var called = false;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (called)
            return;
        f.apply(null, args);
        called = true;
    };
};
export var not = function (f) { return function (a) { return !f(a); }; };
export var allPass = function (fs) {
    if (fs === void 0) { fs = []; }
    return function (a) { return fs.length > 0 && fs.every(function (f) { return f(a); }); };
};
export var anyPass = function (fs) {
    if (fs === void 0) { fs = []; }
    return function (a) { return fs.some(function (f) { return f(a); }); };
};
export function compose() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return fns.reduce(function (f, g) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return f(g.apply(void 0, __spread(args)));
    }; });
}
export function pipe(f1) {
    var fns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fns[_i - 1] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fns.reduce(function (v, f) { return f(v); }, f1.apply(void 0, __spread(args)));
    };
}
//# sourceMappingURL=function.js.map