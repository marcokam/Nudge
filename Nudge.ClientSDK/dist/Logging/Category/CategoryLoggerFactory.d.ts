import { Logger, CategorySettingsProvider, CategoryLoggerFactory } from "../LoggingInterfaces";
import CategoryLogger from "./CategoryLogger";
export declare type LoggerProducer = (() => Logger) | Logger;
export default class DefaultCategoryLoggerFactory implements CategoryLoggerFactory {
    private readonly loggerProducer;
    private categorySettingsProvider;
    private loggers;
    constructor(categorySettingsProvider: CategorySettingsProvider, loggerProducer?: LoggerProducer);
    configure: (settings: CategorySettingsProvider) => void;
    create: (category: string) => CategoryLogger;
    private createLoggerInternal;
}
