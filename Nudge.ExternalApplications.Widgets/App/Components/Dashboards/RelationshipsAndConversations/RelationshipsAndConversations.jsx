import React, { useState, useEffect, useMemo, Fragment } from "react";
import SplitPane from "react-split-pane";
import LRU from "lru-cache";

import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { throwError } from "@nudge/client-sdk/Util/fp/error";
import { noop } from "@nudge/client-sdk/Util/fp/function";

import { AppContext } from "~/App/Context/AppContext.js";
import { getCompanyByIdentity } from "~/App/API/Company/CompanyData.js";

import /*SplitControl,*/ { splitTypes } from "~/App/Components/SplitPanes/SplitControl.jsx";
import ResizablePane from "~/App/Components/SplitPanes/ResizablePane.jsx";
import WrappedRelationshipsContainer from "~/App/Components/Relationships/RelationshipsContainer.jsx";
import WrappedConversationsContainer from "~/App/Components/Conversations/ConversationsContainer.jsx";
import WrappedWidgetsHeader from "~/App/Components/Navigation/WidgetsHeader/WidgetsHeader.jsx";

import "~/App/Components/SplitPanes/SplitPanes.scss";

const halfSize = splitType => (splitType === splitTypes.horizontal ? window.innerHeight / 2 : window.innerWidth / 2);

function RelationshipsAndConversations({ appSettings = {}, navParams = {}, /* showHeader,*/ headerOffsets, updateSettings = noop }) {
    const { relationshipsAndConversations = {} } = appSettings;
    const { /*splitType: defaultSplitType = splitTypes.vertical,*/ size: defaultSize } = relationshipsAndConversations;
    const [windowState, setWindowState] = useState({
        splitType: splitTypes.vertical, /*defaultSplitType*/
        isResizing: false,
        size: defaultSize || halfSize(splitType),
    });
    const [company, setCompany] = useState({});
    const { splitType, isResizing, size } = windowState;
    const { identity = "", } = navParams;
    const cache = useMemo(() => new LRU({ max: 500, maxAge: 1000 * 60 * 60 }), []);

    useEffect(() => {
        updateSettings({
            relationshipsAndConversations: {
                splitType,
                size,
            }
        });
    }, [splitType, size, updateSettings]);
    // get company data
    useEffect(() => {
        if (identity) {
            getCompanyByIdentity(identity, {}, { cache })
                .map(company => (company.uri ? company : throwError("No company found")))
                .fork(
                    err => {
                        logger.error(err);
                    },
                    company => {
                        setCompany(company);
                    },
                );
        }
    }, [cache, identity]);


    return (
        <Fragment>
            <div style={{ paddingTop: headerOffsets.top }} className="flex flex-column h-100">
                <WrappedWidgetsHeader appSettings={appSettings} navParams={navParams} company={company} options={{
                    showRecommendations: true,
                    showAccountRisk: true,
                    showRelationshipsSummary: true,
                    showConversationsSummary: true,
                }} />
                <div className="relative h-100">
                    <SplitPane
                        split={splitType}
                        minSize={100}
                        size={size}
                        onDragStarted={() => setWindowState(prev => ({ ...prev, isResizing: true }))}
                        onDragFinished={size => setWindowState(prev => ({ ...prev, isResizing: false, size }))}
                    >
                        <ResizablePane isResizing={isResizing} rerenderOnResize={splitType === splitTypes.vertical}>
                            <WrappedRelationshipsContainer options={{ showHeader: false }} navParams={navParams} cache={cache} />
                        </ResizablePane>
                        <ResizablePane isResizing={isResizing}>
                            <div className="h-100 w-100 overflow-auto" style={{
                                width: splitType === splitTypes.vertical ? `calc(100vw - ${size}px)` : "100%",
                                height: splitType === splitTypes.horizontal ? `calc(100vh - ${size + 100 + headerOffsets.top}px)` : "100%",
                            }}>
                                <WrappedConversationsContainer options={{ showHeader: false }} navParams={navParams} cache={cache} />
                            </div>
                        </ResizablePane>
                    </SplitPane>
                </div>
            </div>
        </Fragment>
    );
}

const WrappedRelationshipsAndConversations = (props) => (
    <AppContext.Consumer>
        {({ appSettings, updateSettings }) => (
            <RelationshipsAndConversations
                appSettings={appSettings}
                updateSettings={updateSettings}
                {...props}
            />
        )}
    </AppContext.Consumer>
);
WrappedRelationshipsAndConversations.displayName = "RelationshipsAndConversations";

export default WrappedRelationshipsAndConversations;
