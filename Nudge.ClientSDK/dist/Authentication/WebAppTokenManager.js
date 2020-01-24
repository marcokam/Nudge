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
import { invariantTruthy } from "../Util/utils";
import { reusableSingleton, promiseTry, createTimeoutAbortSignal } from "../Util/PromiseUtils";
import HttpError from "../Api/Errors/HttpError";
import registry from "../Util/registry";
var defaultSettings = {
    startingAccessToken: null,
    isImpersonating: false,
    expirationThresholdSeconds: 280,
    userName: "",
    onAccessTokenChange: function () { },
    onRefreshFail: function () { }
};
var WebAppTokenManager = /** @class */ (function () {
    function WebAppTokenManager(settings) {
        var _this = this;
        this.supportsRefresh = true;
        this.getAccessToken = function () { return _this.currentAccessToken; };
        this.refreshAccessToken = function () {
            return _this.performRefresh();
        };
        this.createRefreshTimeout = function (accessTokenExpiresInSeconds) {
            // Refresh the access token when it is close to expiring
            var intervalSeconds = Math.max(accessTokenExpiresInSeconds - _this.settings.expirationThresholdSeconds, 0);
            return setTimeout(_this.performRefreshAndCatch, intervalSeconds * 1000);
        };
        this.performRefreshAndCatch = function () { return _this.performRefresh().catch(function () { }); };
        this.performRefresh = reusableSingleton(function () { return promiseTry(function () {
            registry.logger.info("Refreshing tokens.");
            var body = _this.settings.isImpersonating ? { "impersonateUser": _this.settings.userName } : {};
            var signal = createTimeoutAbortSignal(10000); // 10 seconds
            var options = {
                method: "POST",
                body: JSON.stringify(body),
                headers: __assign({ "Accept": "application/json", "Pragma": "no-cache", "Cache-Control": "no-cache", "Expires": "0" }, _this.settings.additionalHeaders),
                credentials: "same-origin",
                signal: signal
            };
            return fetch(_this.settings.refreshUrl, options);
        })
            .then(function (response) {
            if (response.ok) {
                return response;
            }
            // Refresh token is invalid.  Log the user out.
            //TODO: Consider waiting until the last minute - when the access token is invalid AND refresh fails.
            if (response.status === 403) {
                _this.settings.onRefreshFail();
            }
            throw new HttpError(response);
        })
            .then(function (response) { return response.json(); })
            .then(function (responseObj) {
            var accessToken = responseObj.accessToken;
            var accessTokenExpiresInSeconds = responseObj.accessTokenExpiresInSeconds;
            if (!accessToken) {
                throw Error("Missing access token from refresh API response.");
            }
            if (!accessTokenExpiresInSeconds) {
                throw Error("Missing accessTokenExpiresInSeconds from refresh API response.");
            }
            _this.currentAccessToken = accessToken;
            _this.settings.onAccessTokenChange(accessToken);
            if (_this.refreshTimeoutFunc)
                clearTimeout(_this.refreshTimeoutFunc);
            _this.refreshTimeoutFunc = _this.createRefreshTimeout(accessTokenExpiresInSeconds);
            var response = {
                success: true,
                accessToken: accessToken
            };
            return response;
        })
            .catch(function (err) {
            registry.logger.error("Error refreshing tokens.", err);
            if (_this.refreshTimeoutFunc)
                clearTimeout(_this.refreshTimeoutFunc);
            var response = {
                success: false,
                accessToken: null
            };
            return response;
        }); });
        var finalSettings = Object.assign({}, defaultSettings, settings);
        invariantTruthy(finalSettings.refreshUrl, "missing refreshUrl");
        this.settings = finalSettings;
        if (this.settings.initialExpirySeconds) {
            this.refreshTimeoutFunc = this.createRefreshTimeout(this.settings.initialExpirySeconds);
        }
        this.currentAccessToken = this.settings.startingAccessToken;
    }
    return WebAppTokenManager;
}());
export default WebAppTokenManager;
//# sourceMappingURL=WebAppTokenManager.js.map