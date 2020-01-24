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
var optionsToRequest = function (url, options) {
    var method = options.method || "GET";
    return __assign(__assign({ url: url }, options), { method: method });
};
var DefaultApiClient = /** @class */ (function () {
    function DefaultApiClient(invoker) {
        var _this = this;
        this.request = function (url, options) {
            var request = optionsToRequest(url, options || {});
            return _this.invoker(request);
        };
        this.createRequestNoBody = function (method) { return function (url, options) {
            return _this.request(url, __assign({ method: method }, options));
        }; };
        this.createRequestBody = function (method) { return function (url, data, options) {
            return _this.request(url, __assign({ method: method, body: JSON.stringify(data) }, options));
        }; };
        this.json = function (url, options) {
            var request = optionsToRequest(url, options || {});
            return _this.invoker(request)
                .then(function (response) {
                if (response.status === 204) {
                    return Promise.resolve(undefined);
                }
                return response.json();
            });
        };
        this.createJsonNoBody = function (method) { return function (url, options) {
            return _this.json(url, __assign({ method: method }, options));
        }; };
        this.createJsonBody = function (method) { return function (url, data, options) {
            return _this.json(url, __assign({ method: method, body: JSON.stringify(data) }, options));
        }; };
        this.get = this.createRequestNoBody("GET");
        this.post = this.createRequestBody("POST");
        this.patch = this.createRequestBody("PATCH");
        this.delete = this.createRequestBody("DELETE");
        this.put = this.createRequestBody("PUT");
        this.getJson = this.createJsonNoBody("GET");
        this.postJson = this.createJsonBody("POST");
        this.patchJson = this.createJsonBody("PATCH");
        this.deleteJson = this.createJsonBody("DELETE");
        this.putJson = this.createJsonBody("PUT");
        this.invoker = invoker;
    }
    return DefaultApiClient;
}());
export default DefaultApiClient;
//# sourceMappingURL=DefaultApiClient.js.map