import queryString from "query-string";
import HttpError from "~/App/Errors/HttpError.js";
import logger from "~/App/Services/Logger.js";
import authorization from "~/App/authorization.js";
import { joinAbortSignals, timeoutAbortSignal, abortErrorToSignalAbortedError } from "./promiseUtils.js";
import { trackingId } from "~/App/Utils/singletons.js";

const defaultTimeout = 60000; // default 60s timeout for http calls

function getJsonError(response) {
    return response.text().then(text => {
        if (typeof text === undefined || text === null) return text;
        try {
            return JSON.parse(text);
        } catch (err) {
            return text;
        }
    });
}
function wrappedFetch(url, options = {}) {
    const {
        accessToken = authorization.getAccessToken(),
        timeout = defaultTimeout,
        signal,
        method,
        body
    } = options;
    const headers = getHeaders({
        ...options,
        accessToken,
    });
    const fetchOptions = {
        method,
        body,
        headers,
        signal: joinAbortSignals(timeoutAbortSignal(timeout), signal),
    };

    // see if response or timeout resolves first
    return fetch(url, fetchOptions)
        .then(response => {
            if (response.ok) {
                return response;
            }

            return getJsonError(response).then(jsonError => {
                function throwError() {
                    logger.info("apiUtils request was not successful.", { url, jsonError });
                    throw new HttpError(response, jsonError);
                }

                function retryRequest() {
                    const currentAccessToken = authorization.getAccessToken();
                    if (accessToken === currentAccessToken) {
                        logger.warn(
                            "While retrying the request, discovered that access token did not actually change",
                            { url },
                        );
                        return throwError();
                    }

                    logger.info("Retrying apiUtils request", { url });
                    const nextOptions = {
                        ...options,
                        accessToken: currentAccessToken, // By providing this, the retry will not attempt a refresh.
                    };
                    return wrappedFetch(url, nextOptions);
                }

                // Do not attempt to refresh and retry if the access token was provided in options.
                // This will stop retry and logger loops.
                if (accessToken) {
                    return throwError();
                }

                if (!authorization.shouldRefreshAndRetry(response.status, jsonError)) {
                    return throwError();
                }

                // At this point we know we should retry the request.
                // If the access token changed while the request was in flight, just use that during retry and do not perform a refresh.
                if (accessToken !== authorization.getAccessToken()) {
                    return retryRequest();
                }

                return new Promise((resolve, reject) => {
                    authorization
                        .performRefresh()
                        .then(() => {
                            retryRequest()
                                .then(resolve)
                                .catch(reject);
                        })
                        .catch(throwError)
                        .catch(reject);
                });
            });
        })
        .catch(abortErrorToSignalAbortedError);
}
function wrappedFetchJSON(url, options) {
    return wrappedFetch(url, options).then(response =>
        response.status === 204 ? undefined : response.json().catch(() => undefined),
    );
}
function getHeaders(options = {}) {
    const { accessToken, cache, headers: optionHeaders } = options;
    // Default headers
    const defaultHeaders = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-correlation-type": "widgets",
        "x-nudge-tracking": trackingId,
        mode: "cors",
    };

    let headers = { ...defaultHeaders };

    // Add access token
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Potentially add cache headers
    if (!cache) {
        headers["Pragma"] = "no-cache";
        headers["Cache-Control"] = "no-cache";
        headers["Expires"] = "0";
    }

    // Add headers from options
    if (optionHeaders) {
        headers = {
            ...headers,
            ...optionHeaders,
        };
    }
    return new Headers(headers);
}

const createNoBody = method => (url, options) => wrappedFetch(url, { method, ...options });
const createBody = method => (url, data, options) =>
    wrappedFetch(url, { method, body: JSON.stringify(data), ...options });
const createNoBodyJSON = method => (url, options) => wrappedFetchJSON(url, { method, ...options });
const createBodyJSON = method => (url, data, options) =>
    wrappedFetchJSON(url, { method, body: JSON.stringify(data), ...options });

export const getFetch = createNoBody("GET");
export const postFetch = createBody("POST");
export const patchFetch = createBody("PATCH");
export const deleteFetch = createNoBody("DELETE");
export const putFetch = createBody("PUT");
export const getJSON = createNoBodyJSON("GET");
export const postJSON = createBodyJSON("POST");
export const patchJSON = createBodyJSON("PATCH");
export const deleteJSON = createNoBodyJSON("DELETE");
export const putJSON = createBodyJSON("PUT");

const toURL = uri => `${Nudge.urls.applicationServices}${uri}`;
const constructQuery = query => (query ? `?${queryString.stringify(query)}` : "");

export const getEntity = (uri, query, { fetchOptions, cache } = {}) => {
    const url = `${toURL(uri)}${constructQuery(query)}`;
    const cacheFound = cache && cache.has(url);
    const response = cacheFound ? Promise.resolve(cache.get(url)) : getJSON(`${toURL(uri)}${constructQuery(query)}`, fetchOptions);
    if (cache) {
        response.then(entity => cache.set(url, entity));
    }
    return response;
};
export const postEntity = entity => postJSON(toURL(entity.uri), entity);
export const patchEntity = entity => patchJSON(toURL(entity.uri), entity);
export const putEntity = entity => putJSON(toURL(entity.uri), entity);
export const deleteEntity = entity => deleteJSON(toURL(entity.uri));

/**
 * API States
 */
export const apiStates = {
    none: "", // Never called
    fetching: "fetching", // First call
    fetched: "fetched",
    updating: "updating", // Subsequent calls
    updated: "updated",
    error: "error",
};
