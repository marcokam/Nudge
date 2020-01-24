import React, { Component } from "react";
import { loadState, saveState } from "~/App/Utils/localStorageUtils.js";
import * as Messager from "~/App/Services/Messager.js";
import { splitTypes } from "~/App/Components/SplitPanes/SplitControl.jsx";

export const AppContext = React.createContext({});

export class AppProvider extends Component {
    constructor(props) {
        super(props);
        this.appStateKey = "nudge-widgets-state";
        this.defaultState = {
            relationshipsAndConversations: {
                splitType: splitTypes.vertical,
                size: 0,
            }
        };
        this.state = {
            appSettings: this.loadContext(),
            updateSettings: this.updateSettings,
        };
    }
    render() {
        return <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>;
    }
    componentDidMount() {
        Messager.init();
        this.unsubscribeMessages = Messager.subscribe(
            [Messager.messageTypes.selectTeam],
            this.handleMessages,
        );
    }
    componentWillUnmount() {
        this.unsubscribeMessages();
        Messager.destroy();
    }

    
    loadContext = () => loadState(this.appStateKey) || this.defaultState;

    updateSettings = newSettings => {
        const appSettings = {
            ...this.state.appSettings,
            ...newSettings,
        };
        this.setState({ ...this.state, appSettings }, () => {
            saveState(appSettings, this.appStateKey);
        });
    };
}
