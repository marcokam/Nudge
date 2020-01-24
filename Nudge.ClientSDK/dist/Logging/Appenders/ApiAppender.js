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
var _a;
import { LogLevel } from "../LoggingInterfaces";
import { resolveString, resolveFunction } from "../../Util/utils";
import { voidPromise } from "../../Util/PromiseUtils";
var promiseEmpty = Promise.resolve(null);
var apiRoutes = (_a = {},
    _a[LogLevel.error] = "error",
    _a[LogLevel.warning] = "warning",
    _a[LogLevel.info] = undefined,
    _a[LogLevel.debug] = undefined,
    _a);
function errorTypeName(obj) {
    try {
        return Object.getPrototypeOf(obj).constructor.name;
    }
    catch (e1) {
        // noop
    }
    try {
        return Object.getPrototypeOf(obj).name;
    }
    catch (e2) {
        // noop
    }
    try {
        return Object.prototype.toString.call(obj).slice(8, -1);
    }
    catch (e3) {
        // noop
    }
    return "";
}
;
function resolveExceptionProperties(err) {
    if (!err)
        return {};
    err = resolveFunction(err);
    if (!err)
        return {};
    var message = err.message || resolveString(err);
    var exception = errorTypeName(err);
    var additionalProperties = __assign({}, err);
    additionalProperties.stack = undefined;
    additionalProperties.message = undefined;
    return {
        message: message,
        exception: exception,
        exceptionDetails: err.stack,
        additionalProperties: additionalProperties,
    };
}
function addMetaDataToBody(body, ambientProperties) {
    // Resolve ambientProperties
    var additionalAmbientProperties = {};
    if (ambientProperties) {
        Object.entries(ambientProperties).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            additionalAmbientProperties[key] = resolveFunction(value);
        });
    }
    return __assign(__assign({}, body), { additionalProperties: __assign(__assign({}, additionalAmbientProperties), body.additionalProperties) });
}
//TODO: Deprecate this once we are confident in the implementation of createExceptionRegexFilter.
export var createExceptionFilter = function (exception, message) { return function (_, body) {
    return !(body && body.exception == exception && (!message || body.message == message));
}; };
export var createExceptionRegexFilter = function (exceptionRegExp, messageRegExp) { return function (_, body) {
    // Exception doesn't match
    if (!body || !body.exception || !body.exception.match(exceptionRegExp)) {
        return true;
    }
    // Exception matches and we don't have a Message filter
    if (!messageRegExp) {
        return false;
    }
    // Message doesn't match    
    if (!body || !body.message || !body.message.match(messageRegExp)) {
        return true;
    }
    // Both match
    return false;
}; };
export var joinLogFilters = function () {
    var filters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filters[_i] = arguments[_i];
    }
    return function (level, body) {
        return !filters.find(function (f) { return !f(level, body); });
    };
};
export var abortFilter = createExceptionFilter("DOMException", "The user aborted a request.");
var ApiAppender = /** @class */ (function () {
    function ApiAppender(apiClient, logApiPrefix, ambientProperties, logFilter) {
        this.apiClient = apiClient;
        this.logApiPrefix = logApiPrefix;
        this.ambientProperties = ambientProperties;
        this.logFilter = logFilter || (function () { return true; });
    }
    ApiAppender.prototype.append = function (event) {
        var apiRoute = apiRoutes[event.level];
        if (!apiRoute) {
            return voidPromise;
        }
        var args = event.args();
        // Get Error objects
        var firstErrArgIndex = args.findIndex(function (_) { return _ instanceof Error; });
        var firstErrArg = firstErrArgIndex === -1 ? null : args[firstErrArgIndex];
        var otherArgs = firstErrArg === null ? args : args.filter(function (_, index) { return index !== firstErrArgIndex; });
        var message = otherArgs.map(function (_) { return resolveString(_); }).join(" ");
        if (!firstErrArg) {
            return this.sendToApi(event.level, apiRoute, { message: message });
        }
        var ex = resolveExceptionProperties(firstErrArg);
        var body = __assign(__assign({}, ex), { message: message });
        return this.sendToApi(event.level, apiRoute, body);
    };
    ApiAppender.prototype.sendToApi = function (logLevel, apiRoute, body) {
        if (!apiRoute || body === null || !this.logFilter(logLevel, body)) {
            return promiseEmpty;
        }
        var url = "" + this.logApiPrefix + apiRoute;
        var ambientProperties = this.ambientProperties && this.ambientProperties();
        var actualBody = addMetaDataToBody(body, ambientProperties);
        return this.apiClient.postJson(url, actualBody);
    };
    return ApiAppender;
}());
export default ApiAppender;
//# sourceMappingURL=ApiAppender.js.map