import { ControlInstanceFactorySettings, Params, ComponentConstructor, ControlInstance } from "../ConfigUIInterfaces";
export interface ListElement {
    id: number;
    uri: string;
    displayName: string;
}
export interface ListSelectorProps {
    icon: string;
}
export interface SelectorSettings<TElement> {
    onError(...logArgs: any[]): void;
    getData(params: Params): Promise<{
        defaultUri: string;
        elements: TElement[];
    }>;
    selectComponent: ComponentConstructor;
    idParameterName: string;
    uriParameterName: string;
}
declare const createSelector: <TElement extends ListElement>(selectorSettings: SelectorSettings<TElement>) => (controlSettings: ControlInstanceFactorySettings) => ControlInstance;
export default createSelector;
