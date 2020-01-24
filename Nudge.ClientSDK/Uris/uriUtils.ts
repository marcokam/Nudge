import { Either, either, tryCatch } from "~/Util/fp/Instances/Either";
import { throwError } from "~/Util/fp/error";

const throwInvalidUri = () => throwError("Invalid uri provided");
const tryCatchOnCondition = <E, A, B>(run: (a: A) => B) => (a: A): Either<E, B> => tryCatch(() => run(a));
export const uriToId = (uri: string = "") => either.of(uri)
    .chain(tryCatchOnCondition(uri => uri.includes("/")
        ? uri
        : throwInvalidUri()))
    .map(uri => uri.split("/"))
    .chain(tryCatchOnCondition(parts => parts[parts.length - 1]
        ? parts[parts.length - 1]
        : throwInvalidUri()))
    .chain(tryCatchOnCondition(id => !isNaN(Number(id))
        ? id
        : throwInvalidUri()))


export const idToUri = (baseUri: string) => (id: string) => `${baseUri}/${id}`;
