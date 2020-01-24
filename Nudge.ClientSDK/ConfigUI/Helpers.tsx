// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { 
    Component,
    SFC    
} from "react";
import { v4 as uuid } from "uuid";
import registry from "~/Util/registry";

import { 
    ControlConfiguration as Configuration,
    ControlInstance as Instance,
    ControlInstanceFactory as InstanceFactory,
    ControlInstanceFactorySettings as InstanceFactorySettings,
    ComponentConstructor,
    Context,
    Params,
    ControlInstanceFactorySettings,
    ParameterMappings
} from "./ConfigUIInterfaces";
import { convertParameterMappings } from "./ContextFactory";
import { entries } from "~/Util/ObjectUtils";
import SdkLogCategories from "~/Logging/Category/SdkLogCategories";

const logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);

export class SimpleControlInstance implements Instance {

    constructor(
        controlConfiguration: Configuration,
        component: ComponentConstructor,
        context: Context,
        parent: Instance        
    ) {
        logger.debug(`creating SimpleControlInstance with parameters`, controlConfiguration.parameters);
        this.controlConfiguration = controlConfiguration;        
        this.component = component;
        this.context = context;
        this.parent = parent;
        this.key = uuid();
    }

    readonly controlConfiguration: Configuration;
    readonly component: ComponentConstructor;
    readonly context: Context;
    readonly parent: Instance;
    readonly key: string;
}

// export class SimpleControlInstanceFactory implements InstanceFactory {

//     private readonly componentFactory: (controlConfiguration: Configuration) => ComponentConstructor;    
//     constructor(componentFactory: (controlConfiguration: Configuration) => ComponentConstructor) {
//         this.componentFactory = componentFactory;
//     }

//     create(controlManager: Manager, controlConfiguration: Configuration, parent?: Instance): Instance {
//         const component = this.componentFactory(controlConfiguration);
//         return new SimpleControlInstance(controlConfiguration, component, parent);
//     }
// }

// export class ControlInstanceFactoryImpl implements InstanceFactory {
//     private readonly createFn: (controlManager: Manager, controlConfiguration: Configuration, parent?: Instance) => Instance;
//     constructor(createFn: (controlManager: Manager, controlConfiguration: Configuration, parent?: Instance) => Instance) {
//         this.createFn = createFn;
//     }

//     create(controlManager: Manager, controlConfiguration: Configuration, parent?: Instance): Instance {
//         return this.createFn(controlManager, controlConfiguration, parent);
//     }
// }


export const sfcAsClass = (WrappedComponent: SFC, settings: InstanceFactorySettings) => {
    return class SfcToClass extends Component {
        render() {	
            const props = { ...this.props, context: settings.context };
            return <WrappedComponent {...props} />;	
        }
    }
}

//TODO: The control manager can't actually deal with Promise<InstanceFactory>s
//      but this is going to be necessary in order to support lazy-loading of factories.
export const lazyInstanceFactory = (factoryProducer: () => Promise<InstanceFactory>): Promise<InstanceFactory> => {
    return factoryProducer().then(factory => {
        return (settings: InstanceFactorySettings) => factory(settings);
    });
};

export const sfcFactory = (componentFactory: (settings: InstanceFactorySettings) => SFC): InstanceFactory => {    
    return (settings: InstanceFactorySettings) => {
        const sfc = componentFactory(settings);
        const componentClass = sfcAsClass(sfc, settings);
        return new SimpleControlInstance(settings.controlConfiguration, componentClass, settings.context, settings.parent);
    };
}  

export const componentConstructor = (componentClass: ComponentConstructor): InstanceFactory => {
    return (settings) => {
        return new SimpleControlInstance(settings.controlConfiguration, componentClass, settings.context, settings.parent);
    };
}

export const classFactory = (constructor: (settings: ControlInstanceFactorySettings) => ComponentConstructor): InstanceFactory => {
    
    return (settings) => {
        const componentClass = constructor(settings);
        return new SimpleControlInstance(settings.controlConfiguration, componentClass, settings.context, settings.parent);
    };
} 


const withParamsToPropsPrivate = (componentClass: ComponentConstructor) => (settings: InstanceFactorySettings): Instance => {
    const ComponentClass = componentClass;
    logger.debug(`creating ParamsToProps component with settings`, settings, ComponentClass);
    const paramsToPropsClass = class ParamsToProps extends Component<any, any>{
        
        constructor(props: any) {
            super(props);

            // Set from initial props and context
            const parameters = settings.context.getParameters();
            this.state = { parameters };
            settings.context.subscribe((parameters: Params) => this.setState({ parameters }));
        }

        //TODO: Props don't change, we don't have to recalc in render() at all!
        render = () => {
            // Include any props from parent component                
            const childProps = { ...this.props, ...this.state.parameters, setParameters: settings.context.setParameters };
            logger.info("rendering withParamsToProps", childProps);
            return <ComponentClass { ...childProps } />
        }
    };
    return new SimpleControlInstance(settings.controlConfiguration, paramsToPropsClass, settings.context, settings.parent);
};
export const withParamsToProps = (componentClass: ComponentConstructor, settings?: InstanceFactorySettings): InstanceFactory | Instance => {
    if (settings) {
        return withParamsToPropsPrivate(componentClass)(settings);
    }
    return withParamsToPropsPrivate(componentClass);
};

export const willHaveParam = (settings: InstanceFactorySettings, paramName: string): boolean => {

    // Look for it on fixed parameters
    if (settings.controlConfiguration.parameters && settings.controlConfiguration.parameters[paramName] !== undefined) {
        return true;
    }
    // Look for it on inputParameters
    const convertedInputParams: ParameterMappings = convertParameterMappings(settings.controlConfiguration.inputParameters);

    return entries(convertedInputParams).any(e => e.value === paramName);
}