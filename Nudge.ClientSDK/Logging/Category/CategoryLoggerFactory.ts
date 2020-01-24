import { Logger, CategorySettingsProvider, CategoryLoggerFactory } from "../LoggingInterfaces";
import { isFunction } from "~/Util/utils";
import registry from "~/Util/registry";
import LazyMap from "~/Util/LazyMap";
import CategoryLogger from "./CategoryLogger";
import { forEach } from "~/Util/IterableUtils";

export type LoggerProducer = (() => Logger) | Logger;

export default class DefaultCategoryLoggerFactory implements CategoryLoggerFactory {
    
    private readonly loggerProducer: () => Logger;
    private categorySettingsProvider: CategorySettingsProvider;
    private loggers: LazyMap<string, CategoryLogger>;

    constructor(categorySettingsProvider: CategorySettingsProvider, loggerProducer?: LoggerProducer) {
        this.categorySettingsProvider = categorySettingsProvider;
        
        // Setup Logger producer
        this.loggerProducer = loggerProducer
            ? isFunction(loggerProducer)
                ? loggerProducer as () => Logger
                : () => loggerProducer as Logger
            : () => registry.logger;

        // Set loggers map
        this.loggers = new LazyMap<string, CategoryLogger>(this.createLoggerInternal);
    }

    configure = (settings: CategorySettingsProvider) => {
        this.categorySettingsProvider = settings;

        // Reconfigure existing loggers
        forEach(this.loggers.values.entries(), entry => 
            entry[1].configure(settings.get(entry[0])));
    }

    create = (category: string) => this.loggers.getValue(category);

    private createLoggerInternal = (category: string) =>
        new CategoryLogger(
            this.categorySettingsProvider.get(category),
            this.loggerProducer
        );

}