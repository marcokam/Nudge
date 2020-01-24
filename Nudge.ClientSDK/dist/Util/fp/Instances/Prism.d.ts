import { Option } from "./Option";
export declare const URI = "Prism";
export declare type URI = typeof URI;
export declare class Prism<A, B> {
    readonly tag: "Prism";
    readonly tryGet: (a: A) => Option<B>;
    readonly inject: (b: B, a: A) => A;
    static of: <A_1, B_1>(tryGet: (a: A_1) => Option<B_1>, inject: (b: B_1, a: A_1) => A_1) => Prism<A_1, B_1>;
    constructor(tryGet: (a: A) => Option<B>, inject: (b: B, a: A) => A);
    readonly then: <C>(tryGet: (b: B) => Option<C>, inject: (c: C, b: B) => B) => Prism<A, C>;
}
