import { LogLevel } from "./LoggingInterfaces";
import CustomCategorySettingsProvider from "./Category/CustomCategorySettingsProvider";
import registry from "../Util/registry";
import ComposableLogger from "./ComposableLogger";
import MultiAppender from "./Appenders/MultiAppender";
import FilteringAppender from "./Appenders/FilteringAppender";
import ConsoleAppender from "./Appenders/ConsoleAppender";
import ApiAppender, { abortFilter } from "./Appenders/ApiAppender";
import FunctionArgumentResolver from "./ArgumentResolvers/FunctionArgumentResolver";
import { setupWindowErrorEvent, setupWindowUnhandledRejectionEvent } from "./LogWindowEvents";
export var setupStandardLogger2 = function (loggingConfig, bufferedLogger, logApiPrefix, ambientProperties, apiLogFilter) {
    var defaultCategoryMinimumLevel = loggingConfig.defaultCategoryMinimumLevel, showCategories = loggingConfig.showCategories, consoleSettings = loggingConfig.console, apiSettings = loggingConfig.api;
    // Logger Category configurations
    var defaultCategorySettings = { minLevel: defaultCategoryMinimumLevel };
    var explicit = showCategories.map(function (c) { return ({ key: c, value: { minLevel: LogLevel.debug } }); });
    var categorySettingsProvider = new CustomCategorySettingsProvider(defaultCategorySettings, explicit);
    registry.categoryLoggers.configure(categorySettingsProvider);
    // Setup the real logger
    var logger = new ComposableLogger(new MultiAppender([
        new FilteringAppender(consoleSettings.minimumLevel, new ConsoleAppender()),
        new FilteringAppender(apiSettings.minimumLevel, new ApiAppender(registry.apiClient, logApiPrefix, ambientProperties, apiLogFilter))
    ]), new FunctionArgumentResolver());
    registry.logger = logger;
    // Flush the buffered logger to the real one
    bufferedLogger.setLogger(registry.logger);
    // Setup window events
    setupWindowErrorEvent();
    setupWindowUnhandledRejectionEvent();
};
// Overload currently used by Widgets and MobileUI.
//TODO: change these consumers to use setupStandardLogger2 and then rename and remove the 2
export var setupStandardLogger = function (bufferedLogger, securityManagementUrl, loggingConfig) {
    var ambientProperties = {};
    return setupStandardLogger2(loggingConfig, bufferedLogger, securityManagementUrl + "/api/v1/log/", function () { return ambientProperties; }, abortFilter);
};
//# sourceMappingURL=LoggerInitialization.js.map