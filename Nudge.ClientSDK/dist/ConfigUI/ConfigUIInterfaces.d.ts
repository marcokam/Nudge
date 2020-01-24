import { Component } from "react";
declare type FunctionalComponent = (props: object) => React.ReactElement;
export declare type ComponentConstructor = typeof Component | FunctionalComponent;
export declare type SubscribeFunction = (parameters: Params) => void;
export interface Params {
    [key: string]: any;
}
export interface Context {
    getParameters(): Params;
    setParameters(newParameters: object): void;
    subscribe(subscriber: SubscribeFunction): void;
    isBoundary: boolean;
}
export interface ContextSettings {
    inputParameters: FlexibleParameterMappings;
    persistenceKey: string;
    persistParameters: FlexibleParameterMappings;
    fixedParameters: Params;
}
export interface RootControlConfiguration {
    context: Partial<ContextSettings>;
    rootControl: Partial<ControlConfiguration>;
}
export interface ControlManager {
    create(controlConfiguration: Partial<ControlConfiguration>, parent: ControlInstance): ControlInstance;
    createRoot(config: Partial<RootControlConfiguration>, inputParameters?: Params): Promise<ControlInstance>;
}
export interface ParameterMappings {
    [key: string]: string;
}
export declare type FlexibleParameterMappings = (string | string[] | ParameterMappings);
export interface ControlConfiguration {
    type: string;
    parameters: Params;
    inputParameters: FlexibleParameterMappings;
    outputParameters: FlexibleParameterMappings;
    children: Partial<ControlConfiguration>[];
}
export declare const emptyContextSettings: ContextSettings;
export declare const emptyControlConfiguration: ControlConfiguration;
export declare type ControlInstanceFactory = (settings: ControlInstanceFactorySettings) => ControlInstance;
export interface ControlInstanceFactorySettings {
    readonly controlManager: ControlManager;
    readonly controlConfiguration: ControlConfiguration;
    readonly context: Context;
    readonly parent: ControlInstance;
}
export interface ControlInstance {
    controlConfiguration: ControlConfiguration;
    component: ComponentConstructor;
    context: Context;
    parent?: ControlInstance;
    key?: string;
}
export interface Dictionary<V> {
    [key: string]: V;
}
export declare type ControlDictionary = Dictionary<ControlInstanceFactory>;
export {};
