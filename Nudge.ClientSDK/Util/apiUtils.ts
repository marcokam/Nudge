import queryString from "query-string";
import parse, { Links } from "parse-link-header";
import registry from "~/Util/registry";
import { Task } from "./fp/Instances/Task";
import { ApiRequestOptions } from "~/Api/ApiInterfaces";
import { Query, Entity, GetEntityOptions, Cache } from "~/Data/DataInterfaces";
import { tryCatch } from "./fp/Instances/Option";


const toUrl = (uri: string) => registry.applicationServicesBaseUrl
    .map(base => `${base}${uri}`);
const constructQuery = (query?: Query) => Task.of(query)
    .map(q => q ? `?${queryString.stringify(q)}` : "");
const getFullUrl = (uri: string, query?: Query) =>
    Task.of((url: string): (s: string) => string => (queryString: string) => `${url}${queryString}`)
        .ap(toUrl(uri))
        .ap(constructQuery(query));


const updateCache = (url: string, cache?: Cache) => (entity: any) => {
    if (cache) cache.set(url, entity);
    return entity;
}
export const getEntity = (uri: string, query?: Query, { requestOptions, cache }: GetEntityOptions = {}) =>
    getFullUrl(uri, query)
        .chain(url => cache && cache.has(url)
            ? Task.of(cache.get(url))
            : Task.of(registry.apiClient.getJson(url, requestOptions))
                .map(updateCache(url, cache)));
export const getEntityWithLinkHeaders = (uri: string, query?: Query, { requestOptions, cache }: GetEntityOptions = {}) =>
    getFullUrl(uri, query)
        .chain(url => cache && cache.has(url)
            ? Task.of(cache.get(url))
            : Task.of(registry.apiClient.get(url, requestOptions))
                .chain(response => response.status === 204
                    ? Task.of([undefined, {}])
                    : Task.of(response
                        .json()
                        .then(data => [data, parse(response.headers.get("link") || "")])
                        .catch(() => [undefined, {}])))
                .map(updateCache(url, cache)));
export const getAllEntities = (uri: string, query?: Query, { requestOptions, cache }: GetEntityOptions = {}, iterations = 10): Task<unknown, any> =>
    getEntityWithLinkHeaders(uri, query, { requestOptions, cache })
        .chain(([data = [], links = {}]: [any[], Links] = [] as unknown as [any[], Links]) => {
            const nextUri = tryCatch(() => links.next.url).getOrElse(() => "");
            if (nextUri && iterations > 0) return Task.of(data)
                .chain(data => getAllEntities(nextUri, undefined, { requestOptions, cache }, iterations - 1).map((more = []) => data.concat(more)))
            else return Task.of(data)
        });


export const getJson = (url: string, options?: ApiRequestOptions) => Task.of(registry.apiClient.getJson(url, options));
export const postJson = (url: string, entity: any, options?: ApiRequestOptions) => Task.of(registry.apiClient.postJson(url, entity, options));
export const postEntity = (uri: string, entity: any, options?: ApiRequestOptions) => getFullUrl(uri)
    .chain(url => postJson(url, entity, options));
export const patchEntity = (entity: Entity, options?: ApiRequestOptions) => getFullUrl(entity.uri)
    .chain(url => Task.of(registry.apiClient.patchJson(url, entity, options)));
export const putEntity = (entity: Entity, options?: ApiRequestOptions) => getFullUrl(entity.uri)
    .chain(url => Task.of(registry.apiClient.putJson(url, entity, options)));
export const deleteEntity = (uri: string, options?: ApiRequestOptions) => getFullUrl(uri)
    .chain(url => Task.of(registry.apiClient.deleteJson(url, options)));

/**
 * API States
 */
export interface ApiStates {
    none: ""; // Never called
    notFound: "notFound"; // Not found
    fetching: "fetching"; // First call
    fetched: "fetched"; //
    updating: "updating"; // Subsequent calls
    updated: "updated";
    error: "error";
};
export const apiStates = Object.freeze({
    none: "", // Never called
    notFound: "notFound", // Not found
    fetching: "fetching", // First call
    fetched: "fetched", //
    updating: "updating", // Subsequent calls
    updated: "updated",
    error: "error",
});
