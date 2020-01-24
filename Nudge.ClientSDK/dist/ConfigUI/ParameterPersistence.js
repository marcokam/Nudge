import registry from "../Util/registry";
import { invariant } from "../Util/utils";
import * as StringUtils from "../Util/StringUtils";
import SdkLogCategories from "../Logging/Category/SdkLogCategories";
var logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);
var keyPrefix = "configUI_";
var ApplicationServicesParameterPersistence = /** @class */ (function () {
    function ApplicationServicesParameterPersistence(applicationServicesBaseUrl) {
        var _this = this;
        this.getPersistedParams = function (key) {
            invariant(StringUtils.isAlphaNumericUnderscore(key), "key must be alpha-numeric or underscore");
            var setting = keyPrefix + key;
            var url = _this.urlPrefix + encodeURIComponent(setting);
            logger.debug("Getting params", key);
            return registry.apiClient.getJson(url)
                .then(function (json) {
                logger.debug("Got params", key, json[setting]);
                return json[setting];
            });
        };
        this.savePersistedParams = function (key, params) {
            var _a;
            var setting = keyPrefix + key;
            var url = _this.urlPrefix + setting;
            registry.logger.debug("Saving params", setting, params);
            var body = (_a = {},
                _a[setting] = params,
                _a);
            return registry.apiClient.patchJson(url, body)
                .then(function (json) {
                return json[setting];
            });
        };
        this.urlPrefix = (new URL("/v2/users/current/settings?fields=", applicationServicesBaseUrl)).toString();
        ;
    }
    return ApplicationServicesParameterPersistence;
}());
export { ApplicationServicesParameterPersistence };
//# sourceMappingURL=ParameterPersistence.js.map