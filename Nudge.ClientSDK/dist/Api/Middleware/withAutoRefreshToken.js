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
import { promiseTry } from "../../Util/PromiseUtils";
import { toResult } from "../../Util/fp/Instances/Producer";
import { Task } from "../../Util/fp/Instances/Task";
function getJsonError(response) {
    return response.text().then(function (text) {
        if (typeof text === undefined || text === null)
            return text;
        try {
            return JSON.parse(text);
        }
        catch (err) {
            return text;
        }
    });
}
export function shouldRefreshAndRetry(status, jsonError) {
    //TODO: Allow e.code to be a string for when we eventually change the API contract                        
    return status === 401
        && jsonError
        && Array.isArray(jsonError)
        && jsonError.filter(function (e) { return e.code === 401001; }).length > 0;
}
var withAutoRefreshToken = function (tokenManagerProducer, logger) {
    var tokenManagerResult = toResult(tokenManagerProducer);
    return function (request, next) {
        if (request.accessToken) {
            return next(request);
        }
        return Task.toPromise(tokenManagerResult)
            .then(function (tokenManager) {
            var accessToken = tokenManager.getAccessToken();
            if (!accessToken) {
                return next(request);
            }
            var nextRequest = __assign({ accessToken: accessToken }, request);
            return next(nextRequest)
                .then(function (response) {
                if (response.status != 401) {
                    return response;
                }
                return getJsonError(response)
                    .then(function (jsonError) {
                    var url = nextRequest.url;
                    function retryRequest(newAccessToken) {
                        if (accessToken === newAccessToken) {
                            logger.warning("While retrying the request, discovered that access token did not actually change", { url: url });
                            return Promise.resolve(response);
                        }
                        if (!newAccessToken) {
                            logger.warning("TokenManager indicated refresh was successful but did not return an access token.", { url: url });
                            return Promise.resolve(response);
                        }
                        logger.info("Retrying API request", { url: url });
                        var retryRequest = __assign(__assign({}, nextRequest), { accessToken: newAccessToken });
                        return next(retryRequest);
                    }
                    // Do not attempt to refresh and retry if the access token was provided in options.
                    // This will stop retry and logger loops.
                    if (!tokenManager.supportsRefresh || request.accessToken || !shouldRefreshAndRetry(response.status, jsonError)) {
                        return response;
                    }
                    // At this point we know we should retry the request.
                    // If the access token changed while the request was in flight, just use that during retry and do not perform a refresh.
                    var currentAccessToken = tokenManager.getAccessToken();
                    if (accessToken !== currentAccessToken) {
                        return retryRequest(currentAccessToken);
                    }
                    return promiseTry(function () { return tokenManager
                        .refreshAccessToken()
                        .then(function (refreshResponse) {
                        if (!refreshResponse.success) {
                            return response;
                        }
                        return retryRequest(refreshResponse.accessToken);
                    }); }).catch(function () { return response; });
                });
            });
        });
    };
};
export default withAutoRefreshToken;
//# sourceMappingURL=withAutoRefreshToken.js.map