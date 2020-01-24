export enum LogLevel {
    error = 0,
    warning = 1,
    info = 2,
    debug = 3,
};

export interface LogEvent {
    level: LogLevel;
    // This is deferred as we might perform some resolution on these args
    // and we only want to do that if the level passes filtering and an
    // Appender actually 
    args: () => any[];
}

export interface CategorySettings {
    minLevel: LogLevel;
}

export interface CategorySettingsProvider {
    get(category: string): CategorySettings;
}

export interface CategoryLoggerFactory {
    create(category: string): Logger;
    configure(categorySettingsProvider: CategorySettingsProvider): void;
}

export interface Logger {
    error(...args: any): void;
    warning(...args: any): void;
    info(...args: any): void;
    debug(...args: any): void;
    logEvent(event: LogEvent): void;    
}

export interface LogAppender {
    append(event: LogEvent): Promise<void>;
}

export interface LogArgumentResolver {
    resolve(args: any[]): any[];    
}
