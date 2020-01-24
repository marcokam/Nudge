// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Component } from "react";
import { ComponentConstructor } from "~/ConfigUI/ConfigUIInterfaces";

export interface AsyncLoaderProps {
    asyncChild: Promise<ComponentConstructor>;
    onError: Component;
    onLoading: Component;
}
interface AsyncLoaderState {
    isLoading: boolean;
    isError: boolean;
}
export default class AsyncLoader extends Component<AsyncLoaderProps, AsyncLoaderState> {
    private unmounted: boolean = false;
    private resolvedChild?: ComponentConstructor;

    constructor(props: AsyncLoaderProps) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false
        };
        props.asyncChild
            .then(r => {
                if (this.unmounted) {
                    return;
                }

                this.resolvedChild = r;
                this.setState({
                    isLoading: false
                });
                
            })
            //TODO: Log error
            .catch(() => {
                if (this.unmounted) {
                    return;
                }
                
                this.setState({
                    isLoading: false,
                    isError: true
                });
            });
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        const { isLoading, isError } = this.state;
        if (isLoading) {
            return this.props.onLoading;
        }
        if (isError || !this.resolvedChild) {
            return this.props.onError;
        }
        const Child: ComponentConstructor = this.resolvedChild;
        return (<Child />);
    }
}