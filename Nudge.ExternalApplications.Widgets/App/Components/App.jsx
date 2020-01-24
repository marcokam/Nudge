import React, { Component, Suspense } from "react";
import queryString from "query-string";
import { Switch, Redirect } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";

import authorization from "~/App/authorization.js";
import * as Messager from "~/App/Services/Messager.js";
import { AppProvider } from "~/App/Context/AppContext.js";
import { WidgetProvider } from "~/App/Context/WidgetContext.js";
import { AnalyticsProvider } from "~/App/Context/AnalyticsContext.js";
import { extractRelevantDomain } from "~/App/Utils/domainUtils.js";
import { appModes } from "~/App/Utils/appUtils.js";

import Login from "~/App/Components/Login/Login.jsx";
import Loading from "~/App/Components/Loading/Loading.jsx";
import LazyErrorBoundary from "~/App/Components/Errors/LazyErrorBoundary.jsx";
import {
    LoadableConversations,
    LoadableRelationships,
    LoadableCompanyOrgChart,
    // LoadableSampleCompanyOrgChart,
    LoadableRelationshipsAndConversations,
} from "~/App/Components/LoadableComponent.jsx";
import AnalyticsListener from "~/App/Components/Analytics/AnalyticsListener.jsx";
import AppMenu from "~/App/Components/Navigation/AppMenu/AppMenu.jsx";
import FocusListener from "~/App/Components/Analytics/FocusListener.jsx";

import "./App.scss";


const getNavParams = location => queryString.parse(location.search);
const parseLocation = location => {
    const navParams = getNavParams(location) || {};
    const { mode = "" } = navParams;
    const isStandalone = mode === appModes.standalone;
    return { navParams, showHeader: isStandalone, headerOffsets: { top: isStandalone ? 40 : 0 } };
};

function ProtectedRoute({ component: Component, ...restProps }) {
    const { location, path } = restProps;
    const { navParams = {}, showHeader, headerOffsets } = parseLocation(location);
    const { identity, ...restNavParams } = navParams;
    const foundIdentity = identity
        ? identity
        : decodeURIComponent(location.pathname)
            .replace(path, "")
            .replace(/^\//, "")
            .replace(/\/$/, "");

    return (
        <Route
            {...restProps}
            render={props =>
                authorization.getAccessToken() ? (
                    <Component
                        {...props}
                        showHeader={showHeader}
                        headerOffsets={headerOffsets}
                        navParams={{ identity: extractRelevantDomain(foundIdentity), ...restNavParams }}
                    />
                ) : (
                    <Redirect
                        to={{
                            pathname: `/login`,
                            search: `?from=${encodeURIComponent(props.location.pathname + props.location.search)}`,
                        }}
                    />
                )
            }
        />
    );
}

export default class App extends Component {
    state = { initialized: false };

    render() {
        const { initializedPromise } = this.props;
        const { initialized } = this.state;
        return (
            <BrowserRouter basename={Nudge.routePrefix}>
                <AppProvider>
                    <WidgetProvider>
                        <AnalyticsProvider initializedPromise={initializedPromise}>
                            <AnalyticsListener />
                            <FocusListener />
                            <Switch>
                                <Route path="/login" component={null} />
                                <Route
                                    path="/"
                                    render={routeProps => {
                                        const { location = {} } = routeProps;
                                        const { navParams = {}, showHeader } = parseLocation(location);
                                        return navParams.mode === appModes.dashboard ? null : (
                                            <AppMenu nodeId="appMenu" showHeader={showHeader} />
                                        );
                                    }}
                                />
                            </Switch>
                            {!initialized ? (
                                <Loading />
                            ) : (
                                <LazyErrorBoundary>
                                    <Suspense fallback={<Loading />}>
                                        <Switch>
                                            <Route exact path="/" render={() => <Redirect to={"/login"} />} />
                                            <Route
                                                path="/login"
                                                render={routeProps => (
                                                    <Login onClick={this.login(routeProps)} {...routeProps} />
                                                )}
                                            />

                                            {/* standalone widgets */}
                                            <ProtectedRoute
                                                path="/relationships"
                                                component={props => (
                                                    <LoadableRelationships {...props} displayName="Relationships" />
                                                )}
                                            />
                                            <ProtectedRoute
                                                path="/conversations"
                                                component={props => (
                                                    <LoadableConversations {...props} displayName="Last Contact" />
                                                )}
                                            />
                                            <ProtectedRoute
                                                path="/orgChart"
                                                component={props => (
                                                    <LoadableCompanyOrgChart {...props} displayName="Org Chart" />
                                                )}
                                            />
                                            {/* <ProtectedRoute
                                                path="/sampleOrgChart"
                                                component={props => (
                                                    <LoadableSampleCompanyOrgChart {...props} displayName="Org Chart" />
                                                )}
                                            /> */}

                                            {/* dashboards */}
                                            <ProtectedRoute
                                                path="/dashboards/relationshipsAndConversations"
                                                component={props => (
                                                    <LoadableRelationshipsAndConversations
                                                        {...props}
                                                        displayName="Relationship Intelligence"
                                                    />
                                                )}
                                            />
                                        </Switch>
                                    </Suspense>
                                </LazyErrorBoundary>
                            )}
                        </AnalyticsProvider>
                    </WidgetProvider>
                </AppProvider>
            </BrowserRouter>
        );
    }
    componentDidMount() {
        const { initializedPromise } = this.props;
        initializedPromise.then(this.setInitialized).catch(this.setInitialized);
        Messager.init();
    }
    componentWillUnmount() {
        Messager.destroy();
    }

    login = routeProps => () => {
        const { history, location = {} } = routeProps;
        return authorization.startLogin(() => {
            const { from = "" } = queryString.parse(location.search);
            if (from) {
                history.push(decodeURIComponent(from));
            }
        });
    };
    setInitialized = () => this.setState({ initialized: true });
}
