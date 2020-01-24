import { Either } from "../Util/fp/Instances/Either";
export declare const uriToId: (uri?: string) => Either<unknown, string>;
export declare const idToUri: (baseUri: string) => (id: string) => string;
