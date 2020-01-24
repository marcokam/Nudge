var hasOwnProperty = Object.prototype.hasOwnProperty;
export var regExpEquals = function (x, y) { return x.toString() == y.toString(); };
export var dateEquals = function (x, y) { return x.getTime() == y.getTime(); };
export var strictEquals = function (x, y) { return x === y; };
export var lenientEquals = function (x, y) { return x == y; };
var maybeDate = function (x, y) {
    var xIsDate = x instanceof Date;
    var yIsDate = y instanceof Date;
    if (xIsDate !== yIsDate) {
        return false;
    }
    if (xIsDate && yIsDate) {
        return dateEquals(x, y);
    }
    return undefined;
};
var maybeArray = function (recurse, x, y) {
    var xIsArray = Array.isArray(x);
    var yIsArray = Array.isArray(y);
    if (xIsArray !== yIsArray) {
        return false;
    }
    if (xIsArray && xIsArray) {
        var length_1 = x.length;
        if (length_1 != y.length) {
            return false;
        }
        for (var i = length_1; i--; i !== 0) {
            if (!recurse()(x[i], y[i])) {
                return false;
            }
        }
        return true;
    }
    return undefined;
};
var maybeObject = function (recurse, x, y) {
    if (typeof x !== "object" && typeof y !== "object") {
        return undefined;
    }
    var keys = Object.keys(x);
    var length = keys.length;
    if (length !== Object.keys(y).length) {
        return false;
    }
    for (var i = length; i--; i !== 0) {
        if (!hasOwnProperty.call(y, keys[i])) {
            return false;
        }
    }
    var xObj = x;
    var yObj = y;
    for (var i = length; i-- !== 0;) {
        var key = keys[i];
        if (!recurse()(xObj[key], yObj[key])) {
            return false;
        }
    }
    return true;
};
var maybeRegEx = function (x, y) {
    var xIsRegEx = x instanceof RegExp;
    var yIsRegEx = y instanceof RegExp;
    if (xIsRegEx !== yIsRegEx) {
        return false;
    }
    if (xIsRegEx && yIsRegEx) {
        return regExpEquals(x, y);
    }
    return undefined;
};
var deepEqualsInternal = function (recurse) { return function (a, b) {
    if (strictEquals(a, b)) {
        return true;
    }
    if (a === null || b === null || a === undefined || b === undefined) {
        return a !== a && b !== b;
    }
    // Compare Arrays
    var mArray = maybeArray(recurse, a, b);
    if (mArray !== undefined) {
        return mArray;
    }
    // Compare Dates
    var mDate = maybeDate(a, b);
    if (mDate !== undefined) {
        return mDate;
    }
    // Compare RegExs
    var mRegEx = maybeRegEx(a, b);
    if (mRegEx !== undefined) {
        return mRegEx;
    }
    // Compare Objects
    var mObj = maybeObject(recurse, a, b);
    if (mObj !== undefined) {
        return mObj;
    }
    return false;
}; };
export var deepEqualsWithDepth = function (maxLevels) {
    var step = maxLevels > 1 && maxLevels < Infinity ? 1 : 0;
    return maxLevels > 1
        ? deepEqualsInternal(function () { return deepEqualsWithDepth(maxLevels - step); })
        : deepEqualsInternal(function () { return strictEquals; });
};
var defaultMaximumDepth = 100;
export var deepEquals = deepEqualsWithDepth(defaultMaximumDepth);
export var shallowEquals = deepEqualsWithDepth(1);
//# sourceMappingURL=AreEquals.js.map