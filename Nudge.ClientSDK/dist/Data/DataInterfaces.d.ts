import { ApiRequestOptions } from "../Api/ApiInterfaces";
export declare type valueof<T> = T[keyof T];
export declare type KeyMap<A> = {
    [B in keyof A]: B;
};
export interface Query {
    q?: string;
    by?: string;
    fields?: string;
    limit?: number;
    team?: string;
    list?: string;
    capabilities?: string;
    aggregation?: "none";
    hint?: "analytics";
    type?: string;
}
export interface Entity {
    uri: string;
}
export interface GetEntityOptions {
    requestOptions?: ApiRequestOptions;
    cache?: Cache;
}
export interface Cache {
    has: (k: string) => boolean;
    get: (k: string) => any;
    set: (k: string, v: any) => void;
}
export interface GetEntityOptions {
    requestOptions?: ApiRequestOptions;
    cache?: Cache;
}
