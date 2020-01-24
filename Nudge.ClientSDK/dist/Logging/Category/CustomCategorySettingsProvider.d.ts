import { CategorySettingsProvider, CategorySettings } from "../LoggingInterfaces";
import KeyValuePair from "../../Util/KeyValuePair";
export declare type ExplicitCategorySettings = KeyValuePair<string, CategorySettings>[];
export default class CustomCategorySettingsProvider implements CategorySettingsProvider {
    private readonly explicit;
    private readonly defaultSettings;
    private readonly values;
    constructor(defaultSettings: CategorySettings, explicit?: ExplicitCategorySettings);
    get: (category: string) => CategorySettings;
    private getInternal;
}
