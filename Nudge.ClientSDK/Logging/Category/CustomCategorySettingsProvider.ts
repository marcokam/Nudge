import { CategorySettingsProvider, CategorySettings } from "../LoggingInterfaces";
import LazyMap from "~/Util/LazyMap";
import KeyValuePair from "~/Util/KeyValuePair";

export type ExplicitCategorySettings = KeyValuePair<string, CategorySettings>[];

export default class CustomCategorySettingsProvider implements CategorySettingsProvider {
    
    private readonly explicit: Map<string, CategorySettings>;
    private readonly defaultSettings: CategorySettings;
    private readonly values: LazyMap<string, CategorySettings>;

    constructor(defaultSettings: CategorySettings, explicit?: ExplicitCategorySettings) {

        // Build explicit map
        this.explicit = new Map<string, CategorySettings>();
        if (explicit) {
            explicit.forEach(c => {
                this.explicit.set(c.key, c.value)
            });
        }

        this.defaultSettings = defaultSettings;

        this.values = new LazyMap<string, CategorySettings>(this.getInternal)
    }
    
    get = (category: string) => this.values.getValue(category);

    private getInternal = (key: string): CategorySettings => {
        const explicit = this.explicit.get(key);
        if (explicit) {
            return explicit;
        }
        return this.defaultSettings;
    }
}