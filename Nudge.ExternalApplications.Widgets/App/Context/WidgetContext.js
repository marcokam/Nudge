import React, { useState } from "react";
import { apiStates } from "@nudge/client-sdk/Util/apiUtils";

export const WidgetContext = React.createContext([{}, {}]);

export function WidgetProvider({ children }) {
    const [selectedProfile, setSelectedProfile] = useState({});
    const [viewLocked, setViewLocked] = useState(false);
    const [relationshipSummaries, setRelationshipSummaries] = useState({});
    const [conversationSummaries, setConversationSummaries] = useState({});
    const [selectedTeamUri, setSelectedTeamUri] = useState("");
    const [unaggregatedPeople, setUnaggregatedPeople] = useState({
        apiState: apiStates.none,
        data: [],
    });

    return (
        <WidgetContext.Provider
            value={[
                {
                    selectedProfile,
                    viewLocked,
                    relationshipSummaries,
                    conversationSummaries,
                    selectedTeamUri,
                    unaggregatedPeople,
                },
                {
                    setSelectedProfile,
                    setViewLocked,
                    setRelationshipSummaries,
                    setConversationSummaries,
                    setSelectedTeamUri,
                    setUnaggregatedPeople,
                },
            ]}
        >
            {children}
        </WidgetContext.Provider>
    );
}

export const withWidgetContext = Component =>
    function ComponentWithContext(props) {
        return (
            <WidgetProvider>
                <Component {...props} />
            </WidgetProvider>
        );
    };