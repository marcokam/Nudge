import { Params } from "./ConfigUIInterfaces";
export interface ParameterPersistence {
    getPersistedParams(key: string): Promise<Params>;
    savePersistedParams(key: string, params: Params): Promise<Params>;
}
export declare class ApplicationServicesParameterPersistence implements ParameterPersistence {
    private readonly urlPrefix;
    constructor(applicationServicesBaseUrl: string);
    getPersistedParams: (key: string) => Promise<Params>;
    savePersistedParams: (key: string, params: Params) => Promise<Params>;
}
