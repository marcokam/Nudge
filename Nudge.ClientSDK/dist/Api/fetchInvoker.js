var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import LazyAsyncValue from "../Util/LazyAsyncValue";
// Actually makes the fetch request
var defaultFetchOptions = {
    mode: "cors"
};
var fetchInvoker = function (request) {
    var fetchOptions = __assign({ method: request.method, body: request.body, headers: request.headers, signal: request.signal }, defaultFetchOptions);
    return fetch(request.url, fetchOptions)
        .then(function (response) {
        var lazyText = new LazyAsyncValue(function () { return response.text.apply(response); });
        // Some of our APIs misbehave and return 200 with no body
        // which would result in an error.
        // We also wouldn't be able to call BOTH getText AND getJson 
        // since body is only readable once.
        // Therfore instead of using response.json, we'll use .text
        // and parse to json ourselves.
        var lazyJson = new LazyAsyncValue(function () { return lazyText.getValue()
            .then(function (t) {
            if (typeof (t) === "undefined" || t === null || t === "") {
                return null;
            }
            return JSON.parse(t);
        }); });
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
//# sourceMappingURL=fetchInvoker.js.map