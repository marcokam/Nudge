import { AreEqual } from "./ComparisonInterfaces";

var hasOwnProperty = Object.prototype.hasOwnProperty;

export const regExpEquals = (x: RegExp, y: RegExp) => x.toString() == y.toString();
export const dateEquals = (x: Date, y: Date) => x.getTime() == y.getTime();
export const strictEquals = <T>(x: T, y: T) => x === y;
export const lenientEquals = <T>(x: T, y: T) => x == y;

const maybeDate = (x: any, y: any): boolean | undefined => {
    const xIsDate = x instanceof Date;
    const yIsDate = y instanceof Date;
    if (xIsDate !== yIsDate) {
        return false;
    }
    if (xIsDate && yIsDate) {
        return dateEquals(x as any as Date, y as any as Date);
    }
    return undefined;
};

const maybeArray = (recurse: () => AreEqual<any>, x: any, y: any): boolean | undefined => {
    const xIsArray = Array.isArray(x);
    const yIsArray = Array.isArray(y);
    if (xIsArray !== yIsArray) {
        return false;
    }
    if (xIsArray && xIsArray) {
        const length = x.length;
        if (length != y.length) {
            return false;
        }
        for (let i = length; i--; i !== 0) {
            if (!recurse()(x[i], y[i])) {
                return false;
            }
        }
        return true;
    }    
    return undefined;
}

const maybeObject = <T>(recurse: () => AreEqual<any>, x: T, y: T): boolean | undefined => {

    if (typeof x !== "object" && typeof y !== "object") {
        return undefined;
    }
    const keys = Object.keys(x);
    const length = keys.length;

    if (length !== Object.keys(y).length) {
        return false;
    }

    for (let i = length; i--; i !== 0) {
        if (!hasOwnProperty.call(y, keys[i])) {
            return false;
        }
    }

    const xObj = x as any;
    const yObj = y as any;
    for (let i = length; i-- !== 0;) {
        const key = keys[i];
        if (!recurse()(xObj[key], yObj[key])) {
            return false;
        }
    }
    return true;
}

const maybeRegEx = <T>(x: T, y: T): boolean | undefined => {
    const xIsRegEx = x instanceof RegExp;
    const yIsRegEx = y instanceof RegExp;
    if (xIsRegEx !== yIsRegEx) {
        return false;
    }
    if (xIsRegEx && yIsRegEx) {
        return regExpEquals(x as any as RegExp, y as any as RegExp);
    }
    return undefined;
}

const deepEqualsInternal = <T>(recurse: () => AreEqual<any>) => (a: T, b: T): boolean => {
    
    if (strictEquals(a, b)) {
        return true;
    }
  
    if (a === null || b === null || a === undefined || b === undefined) {
        return a!==a && b!==b;
    }

    // Compare Arrays
    const mArray = maybeArray(recurse, a, b);
    if (mArray !== undefined) {
        return mArray;
    }

    // Compare Dates
    const mDate = maybeDate(a, b);
    if (mDate !== undefined) {
        return mDate;
    }

    // Compare RegExs
    const mRegEx = maybeRegEx(a, b);
    if (mRegEx !== undefined) {
        return mRegEx;
    }

    // Compare Objects
    const mObj = maybeObject(recurse, a, b);
    if (mObj !== undefined) {
        return mObj
    }

    return false;
};

export const deepEqualsWithDepth = <T>(maxLevels: number): AreEqual<T> => {    
    const step = maxLevels > 1 && maxLevels < Infinity ? 1 : 0;     
    return maxLevels > 1
        ? deepEqualsInternal(() => deepEqualsWithDepth(maxLevels - step))
        : deepEqualsInternal(() => strictEquals);
};
const defaultMaximumDepth = 100;
export const deepEquals = deepEqualsWithDepth(defaultMaximumDepth);
export const shallowEquals = deepEqualsWithDepth(1);