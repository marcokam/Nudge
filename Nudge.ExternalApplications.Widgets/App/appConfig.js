import { LogLevel } from "@nudge/client-sdk/Logging/LoggingInterfaces";

const appConfig = {
    api: {
        defaultTimeout: 30000
    },
    logger: {
        defaultCategoryMinimumLevel: LogLevel.warning,
        showCategories: [],
        console: {
            minimumLevel: LogLevel.warning,
        },
        api: {
            minimumLevel: LogLevel.warning,
        }        
    }
};

export default appConfig;