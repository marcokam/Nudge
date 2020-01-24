import React, { Component } from "react";
import registry from "~/Util/registry";
import { ControlInstanceFactorySettings, Params, ComponentConstructor, ControlInstance } from "../ConfigUIInterfaces";
import { SimpleControlInstance } from "../Helpers";

export interface ListElement {
    id: number;
    uri: string;
    displayName: string;
}
export interface ListSelectorProps { 
    icon: string;
};

interface StateType<TElement> { 
    elements: TElement[];
    selectedUri: string | null;
    loading: boolean;
};

export interface SelectorSettings<TElement> {
    onError(...logArgs: any[]): void;
    getData(params: Params): Promise<{ defaultUri: string; elements: TElement[]}>;
    selectComponent: ComponentConstructor;
    //(selectedUri: string | null, children: JSX.Element[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void): Component;
    idParameterName: string;
    uriParameterName: string;
}

const createSelector = <TElement extends ListElement>(selectorSettings: SelectorSettings<TElement>) =>
    (controlSettings: ControlInstanceFactorySettings): ControlInstance => {
        
        const findElement = (from: TElement[], predicate: (element: TElement) => boolean): TElement | null => {
            if (from && from.length > 0) {
                return from.find(predicate) || null;
            }
            return null;
        };
        const findElementByUri = (from: TElement[], uri: string) => findElement(from, e => e.uri === uri);
        const findElementById = (from: TElement[], id: number) => findElement(from, e => e.id === id);
        const findElementByParams = (params: Params, elements: TElement[]): TElement | null => {
            const uri = params[selectorSettings.uriParameterName];
            if (uri) {
                return findElementByUri(elements, uri);
            }
            const id = params[selectorSettings.idParameterName];
            if (id) {
                return findElementById(elements, id);
            }
            return null;
        }

        const component = class SelectorHOC extends Component<any, StateType<TElement>> {
    
            constructor(props: any) {
                super(props);
                this.state = { 
                    elements: [],
                    selectedUri: "",
                    loading: true
                }
            }

            componentDidMount = () => {
                const startingParams = controlSettings.context.getParameters();
                registry.logger.debug("SelectorHOC startingParams = ", startingParams);
                selectorSettings.getData(startingParams)
                    .then(data => {
                        registry.logger.debug("got data", data);
                        const { elements } = data;

                        const select = (params: Params) => {
                            const selected = findElementByParams(params, elements);
                            if (selected) {
                                const selectedUri = selected.uri;
                                this.setState({ elements, loading: false, selectedUri });
                            } else {
                                const first = (elements && elements.length > 0 && elements[0]) || null;
                                if (first) {
                                    this.setState({ elements, loading: false })
                                    this.setSelected(first);                                    
                                }
                            }
                        }

                        // Find selected
                        select(startingParams);

                        // Watch for changes to selected
                        controlSettings.context.subscribe(params => {
                            registry.logger.debug("SelectorHOC newParams = ", params);
                            select(params);
                        })
                    })
                    .catch(selectorSettings.onError);
            }

            render = () => {        
                if (!this.state || this.state.loading) {
                    return <div>loading...</div>;
                }
                
                //TODO: Error state
                //TODO: Empty state

                const children = this.state.elements.map(element => <option key={element.uri} value={element.uri}>{element.displayName}</option>);

                const SelectComponent = selectorSettings.selectComponent;
                return (
                    <SelectComponent selectedUri={this.state.selectedUri} onChange={this.onChangeSelector}>
                        { children }
                    </SelectComponent>
                );
            }

            onChangeSelector = (e: React.ChangeEvent<HTMLSelectElement>) => {
                const uri: string = e.target.value;
                const element = findElementByUri(this.state.elements, uri);
                registry.logger.debug(`onChangeSelector: `, { uri, element});
                this.setSelected(element);
            }

            setSelected = (element: TElement | null) => {
                registry.logger.debug(`selecting element`, element);
                const selectedId = element ? element.id : null;
                const selectedUri = element ? element.uri : null;
                controlSettings.context.setParameters({ 
                    [selectorSettings.idParameterName]: selectedId,
                    [selectorSettings.uriParameterName]: selectedUri
                });
            }
        }

        return new SimpleControlInstance(controlSettings.controlConfiguration, component, controlSettings.context, controlSettings.parent);
    };

export default createSelector;