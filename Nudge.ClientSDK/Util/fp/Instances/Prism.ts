import { Option } from "./Option";


export const URI = "Prism";
export type URI = typeof URI;
 
export class Prism<A, B> {
    readonly tag: "Prism" = "Prism";
    readonly tryGet: (a: A) => Option<B>;
    readonly inject: (b: B, a: A) => A;
    static of = <A, B>(
        tryGet: (a: A) => Option<B>,
        inject: (b: B, a: A) => A,
    ) => new Prism(tryGet, inject);

    constructor(tryGet: (a: A) => Option<B>, inject: (b: B, a: A) => A) {
        this.tryGet = tryGet;
        this.inject = inject;
    }
    
    readonly then = <C>(tryGet: (b: B) => Option<C>, inject: (c: C, b: B) => B): Prism<A, C> => new Prism(
        (a: A) => this.tryGet(a).chain(tryGet),
        (c: C, a: A) => this.tryGet(a)
            .map(b => this.inject(inject(c, b), a))
            .getOrElse(() => c as unknown as A)
    );
}
