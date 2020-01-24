import { Task } from "./fp/Instances/Task";
import { ApiRequestOptions } from "../Api/ApiInterfaces";
import { Query, Entity, GetEntityOptions } from "../Data/DataInterfaces";
export declare const getEntity: (uri: string, query?: Query | undefined, { requestOptions, cache }?: GetEntityOptions) => Task<unknown, any>;
export declare const getEntityWithLinkHeaders: (uri: string, query?: Query | undefined, { requestOptions, cache }?: GetEntityOptions) => Task<unknown, any>;
export declare const getAllEntities: (uri: string, query?: Query | undefined, { requestOptions, cache }?: GetEntityOptions, iterations?: number) => Task<unknown, any>;
export declare const getJson: (url: string, options?: ApiRequestOptions | undefined) => Task<unknown, any>;
export declare const postJson: (url: string, entity: any, options?: ApiRequestOptions | undefined) => Task<unknown, any>;
export declare const postEntity: (uri: string, entity: any, options?: ApiRequestOptions | undefined) => Task<unknown, any>;
export declare const patchEntity: (entity: Entity, options?: ApiRequestOptions | undefined) => Task<unknown, any>;
export declare const putEntity: (entity: Entity, options?: ApiRequestOptions | undefined) => Task<unknown, any>;
export declare const deleteEntity: (uri: string, options?: ApiRequestOptions | undefined) => Task<unknown, any>;
/**
 * API States
 */
export interface ApiStates {
    none: "";
    notFound: "notFound";
    fetching: "fetching";
    fetched: "fetched";
    updating: "updating";
    updated: "updated";
    error: "error";
}
export declare const apiStates: Readonly<{
    none: string;
    notFound: string;
    fetching: string;
    fetched: string;
    updating: string;
    updated: string;
    error: string;
}>;
