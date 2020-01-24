import React, { Component } from "react";

import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";

export default class LazyErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
    componentDidCatch(error, errorInfo) {
        logger.error(error, errorInfo);
        this.setState({ error, errorInfo });
    }
    retry() {
        document.location.reload();
    }
    render() {
        if (this.state.error) {
            return (
                <div className="loadingOverlay">
                    <p>Oops, an error ocurred</p>
                    <button onClick={this.retry}>Retry</button>
                </div>
            );
        }
        return this.props.children;
    }
}