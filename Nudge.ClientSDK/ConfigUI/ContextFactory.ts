import { ParameterPersistence } from "./ParameterPersistence";
import { 
    ContextSettings,
    Context,
    ParameterMappings,
    FlexibleParameterMappings,
    Params,
    ControlConfiguration,
    ControlInstance,
    emptyContextSettings,
    emptyControlConfiguration
} from "./ConfigUIInterfaces";
import Subscribable from "./Subscribable";
import registry from "~/Util/registry";
import * as StringUtils from "~/Util/StringUtils";
import * as AreEquals from "~/Comparison/AreEquals";
import SdkLogCategories from "~/Logging/Category/SdkLogCategories";

const logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);

const findBoundaryContext = (parent: ControlInstance): Context => {
    if (!parent || !parent.context || parent.context.isBoundary || !parent.parent) {
        return parent.context;
    }
    return findBoundaryContext(parent.parent)
}

export const convertParameterMappings = (mappings?: FlexibleParameterMappings): ParameterMappings => {

    const invalid = (msg: string) => new Error("Invalid mappings: " + msg);
    if (!mappings) {
        return {};
    }
    if (Array.isArray(mappings)) {
        const result: ParameterMappings = { };
        (mappings as any[]).forEach(item => {
            if (typeof item === "string") {
                const itemStr = item as string;
                result[itemStr] = itemStr;
            } else {
                throw invalid("Array elements are not strings.");
            }
        });
        return result;
    }

    if (typeof mappings === "string") {
        const itemStr = mappings as string;
        return { [itemStr]: itemStr };
    }

    if (typeof mappings === "object") {
        const result: ParameterMappings = { };
        (Object.keys(mappings)).forEach((key: string) => {
            const value: any = mappings[key];
            if (typeof value === "string") {
                result[key] = value as string;
            } else {
                throw invalid("Object value not a string.");
            }
        })
        return result;
    }

    throw invalid(`Invalid type (${typeof mappings}).`);
};

const invertParameterMappings = (mappings: ParameterMappings): ParameterMappings => {
    const result: ParameterMappings = {};
    Object.keys(mappings).forEach(key => result[mappings[key]] = key);
    return result;
};

const mapParams = (params: Params, mapping: ParameterMappings): Params => {
    
    // mapping = { "collinsListId": "listId" }
    const toMapKeys = Object.keys(mapping).filter(key => params[key]);

    // If there's nothing to map, just return an empty object
    if (toMapKeys.length < 1) {
        return {};
    }

    const result: Params = {};
    toMapKeys.forEach(key => {
        const targetKey = mapping[key];
        result[targetKey] = params[key]
    })
    return result;
};

// Merges parameters from 2 objects.  The second object wins conflicts.
const mergeParams = (first: Params, second: Params): Params => Object.assign({}, first, second);

export default class ContextFactory {

    private readonly parameterPersistence: ParameterPersistence;

    constructor(parameterPersistence: ParameterPersistence) {
        this.parameterPersistence = parameterPersistence;
    }

    createBoundaryContext = (contextSettings: Partial<ContextSettings>, inputParameters: Params): Promise<Context> => {

        const fullContextSettings: ContextSettings = Object.assign({}, emptyContextSettings, contextSettings);
        const persisting = fullContextSettings.persistParameters && fullContextSettings.persistenceKey;
        const inputParamMappings = convertParameterMappings(fullContextSettings.inputParameters);
        const mappedInputParams = mapParams(inputParameters, inputParamMappings);
        const fixedAndInputParams = mergeParams(fullContextSettings.fixedParameters, mappedInputParams);

        const saveParamMapping = convertParameterMappings(fullContextSettings.persistParameters);
        const persistedParameterMappings = invertParameterMappings(saveParamMapping);

        const templatedPersistenceKey = StringUtils.fromTemplate(fullContextSettings.persistenceKey, fixedAndInputParams);

        //TODO: Allow nesting contexts?  Push params up to parent / Pull params down from parent.
        const persistedParamsPromise = persisting
            ? this.parameterPersistence.getPersistedParams(templatedPersistenceKey)
            : Promise.resolve({});
        return persistedParamsPromise
            .then(persistedParams => {
                const persitedMapped = mapParams(persistedParams || {}, persistedParameterMappings);
                const mergedStartingParams = mergeParams(persitedMapped, fixedAndInputParams);
                const subscribableParams = new Subscribable<Params>(mergedStartingParams);

                let lastPersistedParams = persistedParams;

                const that = this;
                function setParameters(newParams: Params, save: boolean): void {            
                    const oldParams = subscribableParams.getValue();
                    const result = { 
                        ...oldParams,
                        ...newParams
                    };            
                    logger.debug("BoundaryContext setParameters called", { oldParams, newParams, result });
                    if (persisting && save) {
                        
                        const paramsToPersist = mapParams(result, saveParamMapping);
                        if (!AreEquals.shallowEquals(lastPersistedParams, paramsToPersist)) {
                            that.parameterPersistence.savePersistedParams(templatedPersistenceKey, paramsToPersist);
                        }
                        lastPersistedParams = paramsToPersist;                        
                    }
                    subscribableParams.setValue(result);
                }
                
                return {
                    getParameters: subscribableParams.getValue,
                    setParameters: (newParams: Params) => setParameters(newParams, true),
                    subscribe: subscribableParams.subscribe,
                    isBoundary: true    
                };
            });

    }

    createControlContext = (controlConfiguration: Partial<ControlConfiguration>, parent: ControlInstance): Context => {
        
        const fullControlConfiguration: ControlConfiguration = Object.assign({}, emptyControlConfiguration, controlConfiguration);
        // Params on the control configuration itself are immutable.  Get them right away.
        const myParams = fullControlConfiguration.parameters;

        // Find the boundary context
        const boundaryContext = findBoundaryContext(parent);

        // Determine if no inputs
        const inputParamMappings = convertParameterMappings(fullControlConfiguration.inputParameters);
        const noInputs = Object.keys(inputParamMappings).length < 1;

        // Subscribe to changes on our boundary, and cache the results of a merge
        // for use in context.subscribe and context.getParameters
        const mappedBoundaryParams = mapParams(boundaryContext.getParameters(), inputParamMappings);
        const startingValue = mergeParams(myParams, mappedBoundaryParams);
        const subscribable = new Subscribable<Params>(startingValue);
        if (!noInputs) {
            boundaryContext.subscribe(boundaryParams => {
                const mappedBoundaryParams = mapParams(boundaryParams, inputParamMappings);
                return subscribable.setValue(mergeParams(myParams, mappedBoundaryParams));
            });
        }

        // Setup a setParameters function
        const outputParamMappings = convertParameterMappings(fullControlConfiguration.outputParameters);
        const noOutputs = Object.keys(outputParamMappings).length < 1;
        const setParameters = noOutputs
            ? () => { }
            : (newParams: Params) => {
                const mappedNewParams = mapParams(newParams, outputParamMappings);
                logger.debug("ControlContext setParameters called", { newParams, mappedNewParams, outputParamMappings});
                boundaryContext.setParameters(mappedNewParams);
            };
        return {
            subscribe: subscribable.subscribe,
            getParameters: subscribable.getValue,
            setParameters,
            isBoundary: false
        };
    }

}
