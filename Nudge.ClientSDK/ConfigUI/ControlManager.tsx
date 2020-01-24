import { 
    ControlConfiguration,
    ControlManager,
    ControlInstance,
    ControlDictionary,
    ComponentConstructor,
    RootControlConfiguration,
    Params,
    emptyControlConfiguration
} from "./ConfigUIInterfaces";
import BuiltInControls from "./BuiltInControls";
import * as React from "react";
import registry from "~/Util/registry";
import { ParameterPersistence } from "./ParameterPersistence";
import ContextFactory from "./ContextFactory";
import SdkLogCategories from "~/Logging/Category/SdkLogCategories";

const logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);

export default class ControlManagerImpl implements ControlManager {

    private readonly controlDefinitions: ControlDictionary;
    private readonly contextFactory: ContextFactory;

    constructor(controlDefinitions: ControlDictionary, parameterPersistence: ParameterPersistence) {
        this.controlDefinitions = controlDefinitions;
        this.contextFactory = new ContextFactory(parameterPersistence);
    }
    
    create = (controlConfiguration: Partial<ControlConfiguration>, parent: ControlInstance): ControlInstance => {

        const fullControlConfiguration = Object.assign({}, emptyControlConfiguration, controlConfiguration);
        const typeName = fullControlConfiguration.type;
        if (!typeName) {
            throw Error(`Type is required`);
        }
        const def = this.controlDefinitions[typeName];
        if (!def) {
            throw Error(`Unable to locate ControlTypeDefinition for specified type ${typeName}`);
        }

        // Make sure if parameters and children aren't specified, we populate with empty object/array.
        // This can happen when config is deserialized or set in non-TypeScript code.
        const configCopy = {
            parameters: {},
            children: [],
            ...fullControlConfiguration
        };

        const context = this.contextFactory.createControlContext(fullControlConfiguration, parent)
        logger.debug(`creating control ${typeName} with parameters and context`, fullControlConfiguration.parameters, parent.context);

        return def({
            controlManager: this,
            controlConfiguration: configCopy,
            context,
            parent,
        });
    }

    createRoot = (config: Partial<RootControlConfiguration>, inputParameters: Params): Promise<ControlInstance> => {        
        
        const controlConfiguration = config.rootControl || emptyControlConfiguration;
        return this.contextFactory.createBoundaryContext(config.context || {}, inputParameters)
            .then(context => {
                let TopComponent: ComponentConstructor;         
                const rootComponent = class RootComponent extends React.Component<object, {params: object}> {

                    constructor(props?: any) {
                        super(props);
                    }

                    render = () => {
                        return (
                            <TopComponent />
                        );
                    }
                };
                const rootConfig: ControlConfiguration = {
                    type: "Root",
                    parameters: {},
                    children: [ controlConfiguration ],
                    inputParameters: [],
                    outputParameters: []
                };
                const rootInstance: ControlInstance = {
                    controlConfiguration: rootConfig,   
                    component: rootComponent,
                    context
                };
                const specifiedControl = this.create(controlConfiguration, rootInstance)
                TopComponent = specifiedControl.component;
                return rootInstance;
            });
    }
};

//TODO: This should be a test as this is probably not used, mostly just asserts that BuiltInControls is the right type.
export const createWithBuiltInControls = (parameterPersistence: ParameterPersistence): ControlManager => {
    return new ControlManagerImpl(BuiltInControls, parameterPersistence);
}

export const combineDefinitions = (...controlDefinitions: ControlDictionary[]): ControlDictionary => {
    const combined = {};
    controlDefinitions.forEach(defs => Object.assign(combined, defs));
    return combined;
}