var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import queryString from "query-string";
import parse from "parse-link-header";
import registry from "./registry";
import { Task } from "./fp/Instances/Task";
import { tryCatch } from "./fp/Instances/Option";
var toUrl = function (uri) { return registry.applicationServicesBaseUrl
    .map(function (base) { return "" + base + uri; }); };
var constructQuery = function (query) { return Task.of(query)
    .map(function (q) { return q ? "?" + queryString.stringify(q) : ""; }); };
var getFullUrl = function (uri, query) {
    return Task.of(function (url) { return function (queryString) { return "" + url + queryString; }; })
        .ap(toUrl(uri))
        .ap(constructQuery(query));
};
var updateCache = function (url, cache) { return function (entity) {
    if (cache)
        cache.set(url, entity);
    return entity;
}; };
export var getEntity = function (uri, query, _a) {
    var _b = _a === void 0 ? {} : _a, requestOptions = _b.requestOptions, cache = _b.cache;
    return getFullUrl(uri, query)
        .chain(function (url) { return cache && cache.has(url)
        ? Task.of(cache.get(url))
        : Task.of(registry.apiClient.getJson(url, requestOptions))
            .map(updateCache(url, cache)); });
};
export var getEntityWithLinkHeaders = function (uri, query, _a) {
    var _b = _a === void 0 ? {} : _a, requestOptions = _b.requestOptions, cache = _b.cache;
    return getFullUrl(uri, query)
        .chain(function (url) { return cache && cache.has(url)
        ? Task.of(cache.get(url))
        : Task.of(registry.apiClient.get(url, requestOptions))
            .chain(function (response) { return response.status === 204
            ? Task.of([undefined, {}])
            : Task.of(response
                .json()
                .then(function (data) { return [data, parse(response.headers.get("link") || "")]; })
                .catch(function () { return [undefined, {}]; })); })
            .map(updateCache(url, cache)); });
};
export var getAllEntities = function (uri, query, _a, iterations) {
    var _b = _a === void 0 ? {} : _a, requestOptions = _b.requestOptions, cache = _b.cache;
    if (iterations === void 0) { iterations = 10; }
    return getEntityWithLinkHeaders(uri, query, { requestOptions: requestOptions, cache: cache })
        .chain(function (_a) {
        var _b = __read(_a === void 0 ? [] : _a, 2), _c = _b[0], data = _c === void 0 ? [] : _c, _d = _b[1], links = _d === void 0 ? {} : _d;
        var nextUri = tryCatch(function () { return links.next.url; }).getOrElse(function () { return ""; });
        if (nextUri && iterations > 0)
            return Task.of(data)
                .chain(function (data) { return getAllEntities(nextUri, undefined, { requestOptions: requestOptions, cache: cache }, iterations - 1).map(function (more) {
                if (more === void 0) { more = []; }
                return data.concat(more);
            }); });
        else
            return Task.of(data);
    });
};
export var getJson = function (url, options) { return Task.of(registry.apiClient.getJson(url, options)); };
export var postJson = function (url, entity, options) { return Task.of(registry.apiClient.postJson(url, entity, options)); };
export var postEntity = function (uri, entity, options) { return getFullUrl(uri)
    .chain(function (url) { return postJson(url, entity, options); }); };
export var patchEntity = function (entity, options) { return getFullUrl(entity.uri)
    .chain(function (url) { return Task.of(registry.apiClient.patchJson(url, entity, options)); }); };
export var putEntity = function (entity, options) { return getFullUrl(entity.uri)
    .chain(function (url) { return Task.of(registry.apiClient.putJson(url, entity, options)); }); };
export var deleteEntity = function (uri, options) { return getFullUrl(uri)
    .chain(function (url) { return Task.of(registry.apiClient.deleteJson(url, options)); }); };
;
export var apiStates = Object.freeze({
    none: "",
    notFound: "notFound",
    fetching: "fetching",
    fetched: "fetched",
    updating: "updating",
    updated: "updated",
    error: "error",
});
//# sourceMappingURL=apiUtils.js.map