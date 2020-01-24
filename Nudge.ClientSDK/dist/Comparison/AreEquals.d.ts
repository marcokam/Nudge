import { AreEqual } from "./ComparisonInterfaces";
export declare const regExpEquals: (x: RegExp, y: RegExp) => boolean;
export declare const dateEquals: (x: Date, y: Date) => boolean;
export declare const strictEquals: <T>(x: T, y: T) => boolean;
export declare const lenientEquals: <T>(x: T, y: T) => boolean;
export declare const deepEqualsWithDepth: <T>(maxLevels: number) => AreEqual<T>;
export declare const deepEquals: AreEqual<unknown>;
export declare const shallowEquals: AreEqual<unknown>;
