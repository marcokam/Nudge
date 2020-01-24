import React, { Component } from "react";
import { ComponentConstructor } from "../ConfigUI/ConfigUIInterfaces";
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
    private unmounted;
    private resolvedChild?;
    constructor(props: AsyncLoaderProps);
    componentWillUnmount(): void;
    render(): JSX.Element | React.Component<{}, {}, any>;
}
export {};
