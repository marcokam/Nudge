import { LogLevel } from "../Logging/LoggingInterfaces";
import DefaultCategoryLoggerFactory from "../Logging/Category/CategoryLoggerFactory";
import CustomCategorySettingsProvider from "../Logging/Category/CustomCategorySettingsProvider";
import { Task } from "./fp/Instances/Task";
export default {
    logger: null,
    categoryLoggers: new DefaultCategoryLoggerFactory(new CustomCategorySettingsProvider({ minLevel: LogLevel.debug })),
    apiClient: null,
    baseUrl: Task.reject("baseUrl must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
    applicationServicesBaseUrl: Task.reject("applicationServicesBaseUrl must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
    webappBaseUrl: Task.reject("webappBaseUrl must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
    applicationServiceCdnURL: Task.reject("applicationServiceCdnURL must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
};
//# sourceMappingURL=registry.js.map