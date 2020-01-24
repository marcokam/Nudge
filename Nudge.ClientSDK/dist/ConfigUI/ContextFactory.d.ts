import { ParameterPersistence } from "./ParameterPersistence";
import { ContextSettings, Context, ParameterMappings, Params, ControlConfiguration, ControlInstance } from "./ConfigUIInterfaces";
export declare const convertParameterMappings: (mappings?: string | string[] | ParameterMappings | undefined) => ParameterMappings;
export default class ContextFactory {
    private readonly parameterPersistence;
    constructor(parameterPersistence: ParameterPersistence);
    createBoundaryContext: (contextSettings: Partial<ContextSettings>, inputParameters: Params) => Promise<Context>;
    createControlContext: (controlConfiguration: Partial<ControlConfiguration>, parent: ControlInstance) => Context;
}
