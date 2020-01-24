import { 
    Component    
} from "react";

type FunctionalComponent = (props: object) => React.ReactElement;
export type ComponentConstructor = typeof Component | FunctionalComponent;

export type SubscribeFunction = (parameters: Params) => void;
export interface Params { [key: string]: any };
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
export interface ParameterMappings { [key: string]: string };
export type FlexibleParameterMappings = (string | string[] | ParameterMappings);
export interface ControlConfiguration {
    type: string;
    parameters: Params;
    inputParameters: FlexibleParameterMappings;
    outputParameters: FlexibleParameterMappings;
    children: Partial<ControlConfiguration>[];
}

export const emptyContextSettings: ContextSettings = {
    inputParameters: [],
    persistenceKey: "",
    persistParameters: [],
    fixedParameters: {}    
};
export const emptyControlConfiguration: ControlConfiguration = {
    type: "",
    parameters: {},
    inputParameters: [],
    outputParameters: [],
    children: []
};

export type ControlInstanceFactory = (settings: ControlInstanceFactorySettings) => ControlInstance;

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

export type ControlDictionary = Dictionary<ControlInstanceFactory>;
