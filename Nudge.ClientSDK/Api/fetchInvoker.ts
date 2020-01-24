import { ApiRequestInvoker, ApiRequest, ApiResponse } from "./ApiInterfaces";
import LazyAsyncValue from "~/Util/LazyAsyncValue";

// Actually makes the fetch request
const defaultFetchOptions: RequestInit = { 
    mode: "cors"
};
const fetchInvoker: ApiRequestInvoker = (request: ApiRequest): Promise<ApiResponse> => {
    
    const fetchOptions = {
        method: request.method,
        body: request.body,
        headers: request.headers,
        signal: request.signal,
        ...defaultFetchOptions,
    };
    return fetch(request.url, fetchOptions)
        .then((response: Response) => {
            const lazyText = new LazyAsyncValue(() => response.text.apply(response));

            // Some of our APIs misbehave and return 200 with no body
            // which would result in an error.
            // We also wouldn't be able to call BOTH getText AND getJson 
            // since body is only readable once.
            // Therfore instead of using response.json, we'll use .text
            // and parse to json ourselves.
            const lazyJson = new LazyAsyncValue(() => lazyText.getValue()
                .then(t => {
                    if (typeof(t) === "undefined" || t === null || t === "") {
                        return null;
                    }
                    return JSON.parse(t);
                })
            );

            return {
                ok: response.ok,
                url: response.url,
                status: response.status,
                text: lazyText.getValue,
                json: lazyJson.getValue,                
                headers: response.headers,

                // Following methods are Deprecated
                getText: lazyText.getValue,
                getJson: lazyJson.getValue
            };
        });
};

export default fetchInvoker;