import { LogLevel } from "./LoggingInterfaces";
import BufferedLogger from "./BufferedLogger";
import CustomCategorySettingsProvider from "./Category/CustomCategorySettingsProvider";
import registry from "~/Util/registry";
import ComposableLogger from "./ComposableLogger";
import MultiAppender from "./Appenders/MultiAppender";
import FilteringAppender from "./Appenders/FilteringAppender";
import ConsoleAppender from "./Appenders/ConsoleAppender";
import ApiAppender, { abortFilter, LogFilter } from "./Appenders/ApiAppender";
import FunctionArgumentResolver from "./ArgumentResolvers/FunctionArgumentResolver";
import { setupWindowErrorEvent, setupWindowUnhandledRejectionEvent } from "./LogWindowEvents";

export interface LoggingConfig {
    defaultCategoryMinimumLevel: LogLevel;
    showCategories: string[];
    console: {
        minimumLevel: LogLevel;
    };
    api: {
        minimumLevel: LogLevel;
    };
}

export const setupStandardLogger2 = (
    loggingConfig: LoggingConfig, 
    bufferedLogger: BufferedLogger, 
    logApiPrefix: string, 
    ambientProperties: () => any | undefined, 
    apiLogFilter?: LogFilter
) => {
    const { 
        defaultCategoryMinimumLevel,
        showCategories,
        console: consoleSettings,
        api: apiSettings
    } = loggingConfig;
    
    // Logger Category configurations
    const defaultCategorySettings = { minLevel: defaultCategoryMinimumLevel };
    const explicit = showCategories.map(c => ({ key: c, value: { minLevel: LogLevel.debug } }));    
    const categorySettingsProvider = new CustomCategorySettingsProvider(defaultCategorySettings, explicit);
    registry.categoryLoggers.configure(categorySettingsProvider);

    // Setup the real logger
    const logger = new ComposableLogger(
        new MultiAppender([
            new FilteringAppender(
                consoleSettings.minimumLevel, 
                new ConsoleAppender()
            ),
            new FilteringAppender(
                apiSettings.minimumLevel,
                new ApiAppender(registry.apiClient, logApiPrefix, ambientProperties, apiLogFilter)
            )
        ]),
        new FunctionArgumentResolver()
    );
    registry.logger = logger;

    // Flush the buffered logger to the real one
    bufferedLogger.setLogger(registry.logger);

    // Setup window events
    setupWindowErrorEvent();
    setupWindowUnhandledRejectionEvent();
};

// Overload currently used by Widgets and MobileUI.
//TODO: change these consumers to use setupStandardLogger2 and then rename and remove the 2
export const setupStandardLogger = (bufferedLogger: BufferedLogger, securityManagementUrl: string, loggingConfig: LoggingConfig) => {
    const ambientProperties = {};
    return setupStandardLogger2(loggingConfig, bufferedLogger, `${securityManagementUrl}/api/v1/log/`, () => ambientProperties, abortFilter);
}
    
