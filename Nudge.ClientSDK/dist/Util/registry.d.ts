import { Logger } from "../Logging/LoggingInterfaces";
import ApiClient from "../Api/ApiInterfaces";
import DefaultCategoryLoggerFactory from "../Logging/Category/CategoryLoggerFactory";
import { Task } from "./fp/Instances/Task";
declare const _default: {
    logger: Logger;
    categoryLoggers: DefaultCategoryLoggerFactory;
    apiClient: ApiClient;
    baseUrl: Task<unknown, string>;
    applicationServicesBaseUrl: Task<unknown, string>;
    webappBaseUrl: Task<unknown, string>;
    applicationServiceCdnURL: Task<unknown, string>;
};
export default _default;
