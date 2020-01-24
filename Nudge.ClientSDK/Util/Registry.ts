import { Logger, LogLevel } from "~/Logging/LoggingInterfaces";
import ApiClient from "~/Api/ApiInterfaces";
import DefaultCategoryLoggerFactory from "~/Logging/Category/CategoryLoggerFactory";
import CustomCategorySettingsProvider from "~/Logging/Category/CustomCategorySettingsProvider";
import { Task } from "~/Util/fp/Instances/Task";

export default {
    logger: (null as any as Logger),    
    categoryLoggers: new DefaultCategoryLoggerFactory(new CustomCategorySettingsProvider({ minLevel: LogLevel.debug })),
    apiClient: (null as any as ApiClient),
    baseUrl: Task.reject<unknown, string>("baseUrl must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
    applicationServicesBaseUrl: Task.reject<unknown, string>("applicationServicesBaseUrl must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
    webappBaseUrl: Task.reject<unknown, string>("webappBaseUrl must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
    applicationServiceCdnURL: Task.reject<unknown, string>("applicationServiceCdnURL must be provided by the client when initializing the registry.  Make sure to do this before using apiUtils."),
};
