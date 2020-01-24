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
var _a;
import { Task } from "../Util/fp/Instances/Task";
import registry from "../Util/registry";
export var GrantType;
(function (GrantType) {
    GrantType["AuthorizationCode"] = "authorization_code";
    GrantType["RefreshToken"] = "refresh_token";
})(GrantType || (GrantType = {}));
var grantTypeKeys = (_a = {},
    _a[GrantType.AuthorizationCode] = "code",
    _a[GrantType.RefreshToken] = "refresh_token",
    _a);
export var TokenPostErrorCode;
(function (TokenPostErrorCode) {
    TokenPostErrorCode["InvalidGrant"] = "invalid_grant";
})(TokenPostErrorCode || (TokenPostErrorCode = {}));
function tokenPostError(reason, err) {
    registry.logger.error("login failed", { reason: reason }, err);
    return { isSuccess: false };
}
export function isTokenPostError(responseOrError) {
    return !responseOrError.isSuccess;
}
var OAuthClient = /** @class */ (function () {
    function OAuthClient(clientConfig) {
        var _this = this;
        this.tokenPost = function (grantType, grantValue) { return Task.toPromise(_this.clientConfig)
            .then(function (config) {
            var clientId = config.clientId, clientSecret = config.clientSecret, tokenPostUrl = config.tokenPostUrl;
            var grantKey = grantTypeKeys[grantType];
            var tokenPostBody = "client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=" + grantType + "&" + grantKey + "=" + grantValue;
            return fetch(tokenPostUrl, {
                method: "POST",
                body: tokenPostBody,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            });
        })
            .then(function (response) {
            if (!response.ok) {
                // Consuming code may want to know when specific errors happen.  eg "invalid_grant"
                if (response.status === 400) {
                    return response.json().then(function (b) { return ({ isSuccess: false, error: b.error }); });
                }
                return tokenPostError("token-post request failed with status code " + status);
            }
            // Success.  Just add the "isSuccess" property to it
            return response.json().then(function (tpr) { return (__assign({ isSuccess: true }, tpr)); });
        }); };
        this.useAuthorizationCode = function (responseUrl) {
            var qsParams = responseUrl.searchParams;
            // Check for an error on the query string
            var error = qsParams.get("error");
            if (error) {
                return Promise.resolve(tokenPostError(error));
            }
            // Pull the authorization code off the query string
            var authorizationCode = qsParams.get("code");
            if (!authorizationCode) {
                return Promise.resolve(tokenPostError("missing code"));
            }
            // Call token-post endpoint to trade code for refresh and access tokens
            return _this.tokenPost(GrantType.AuthorizationCode, authorizationCode)
                .then(function (tpr) {
                if (isTokenPostError(tpr)) {
                    return tpr;
                }
                // Get the refresh_token and access_token off the response
                var refreshToken = tpr.refresh_token;
                var accessToken = tpr.access_token;
                if (!refreshToken) {
                    return tokenPostError("refresh_token missing");
                }
                if (!accessToken) {
                    return tokenPostError("access_token missing");
                }
                return tpr;
            });
        };
        this.clientConfig = clientConfig;
    }
    return OAuthClient;
}());
export default OAuthClient;
//# sourceMappingURL=OAuthClient.js.map