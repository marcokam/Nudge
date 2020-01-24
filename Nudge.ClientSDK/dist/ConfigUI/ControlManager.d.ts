import { ControlConfiguration, ControlManager, ControlInstance, ControlDictionary, RootControlConfiguration, Params } from "./ConfigUIInterfaces";
import { ParameterPersistence } from "./ParameterPersistence";
export default class ControlManagerImpl implements ControlManager {
    private readonly controlDefinitions;
    private readonly contextFactory;
    constructor(controlDefinitions: ControlDictionary, parameterPersistence: ParameterPersistence);
    create: (controlConfiguration: Partial<ControlConfiguration>, parent: ControlInstance) => ControlInstance;
    createRoot: (config: Partial<RootControlConfiguration>, inputParameters: Params) => Promise<ControlInstance>;
}
export declare const createWithBuiltInControls: (parameterPersistence: ParameterPersistence) => ControlManager;
export declare const combineDefinitions: (...controlDefinitions: import("./ConfigUIInterfaces").Dictionary<import("./ConfigUIInterfaces").ControlInstanceFactory>[]) => import("./ConfigUIInterfaces").Dictionary<import("./ConfigUIInterfaces").ControlInstanceFactory>;
