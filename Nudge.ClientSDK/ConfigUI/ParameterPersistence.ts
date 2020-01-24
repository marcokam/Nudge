import { Params } from "./ConfigUIInterfaces";
import registry from "~/Util/registry";
import { invariant } from "~/Util/utils";
import * as StringUtils from "~/Util/StringUtils";
import SdkLogCategories from "~/Logging/Category/SdkLogCategories";

const logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);

export interface ParameterPersistence {
    getPersistedParams(key: string): Promise<Params>;
    savePersistedParams(key: string, params: Params): Promise<Params>;
}

const keyPrefix = "configUI_";
export class ApplicationServicesParameterPersistence implements ParameterPersistence {

    private readonly urlPrefix: string;

    constructor(applicationServicesBaseUrl: string) {
        this.urlPrefix = (new URL(`/v2/users/current/settings?fields=`, applicationServicesBaseUrl)).toString();;
    }

    getPersistedParams = (key: string): Promise<Params> => {

        invariant(StringUtils.isAlphaNumericUnderscore(key), "key must be alpha-numeric or underscore");
        const setting = keyPrefix + key;
        const url = this.urlPrefix + encodeURIComponent(setting);
        logger.debug("Getting params", key);
        return registry.apiClient.getJson(url)
            .then(json => {
                logger.debug("Got params", key, json[setting]);
                return json[setting] as Params;
            });
    }

    savePersistedParams = (key: string, params: Params): Promise<Params> => {
        const setting = keyPrefix + key;
        const url = this.urlPrefix + setting;
        registry.logger.debug("Saving params", setting, params);
        const body = {
            [setting]: params
        };
        return registry.apiClient.patchJson(url, body)
            .then(json => {
                return json[setting] as Params;
            });
    }
}