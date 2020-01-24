import { None, Some } from "./Option";
import { List } from "./List";
import { Task } from "./Task";
import { Either } from "./Either";
import { Pred } from "./Pred";
import { Compare } from "./Compare";
import { Pair } from "./Pair";
import { Prism } from "./Prism";
import { Arrow } from "./Arrow";

export interface URI2HKT<A> {
    Option: Some<NonNullable<A>> | None<NonNullable<A>>;
    List: List<A>;
    Pred: Pred<A>;
    Compare: Compare<A>;
}
export interface URI2HKT2<E, A> {
    Task: Task<E, A>;
    Either: Either<E, A>;
    Pair: Pair<E, A>;
    Prism: Prism<E, A>;
    Arrow: Arrow<E, A>;
}