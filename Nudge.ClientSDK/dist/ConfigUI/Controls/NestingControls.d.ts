import { ControlInstance, ControlInstanceFactory, ComponentConstructor, ControlInstanceFactorySettings } from "../ConfigUIInterfaces";
interface GetChildInstances {
    getChildInstances(): ControlInstance[];
}
declare type NestingControlInstanceFactorySettings = ControlInstanceFactorySettings & GetChildInstances;
export declare const simpleNestingClassFactory: (constructor: (settings: NestingControlInstanceFactorySettings) => ComponentConstructor) => ControlInstanceFactory;
export declare const conditionalStacked: (predicate: () => boolean) => ControlInstanceFactory;
export declare const Stacked: ControlInstanceFactory;
export declare const GridView: ControlInstanceFactory;
export {};
