import React, { Fragment, useState, useEffect, useRef, useMemo, useCallback, useContext } from "react";
import { debounce } from "lodash";
import { isSameDay, differenceInCalendarDays } from "date-fns";
import LRU from "lru-cache";

import { throwError } from "@nudge/client-sdk/Util/fp/error";
import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { currentUserSettingsKeys, updateCurrentUserSettings, getCurrentUserSettings } from "@nudge/client-sdk/Data/User/userData";
import { id } from "@nudge/client-sdk/Util/fp/function";
import { isEmptyObject } from "@nudge/client-sdk/Util/ObjectUtils";
import {
    generateInitialHeatmaps,
    getSortedConversations,
    formatConversations,
    conversationDisplayTypes,
    formatCompanyTeamConversations,
} from "@nudge/client-sdk/Data/Team/Conversation/conversationData";
import { apiStates } from "@nudge/client-sdk/Util/apiUtils";

import { getCompanyByIdentity } from "~/App/API/Company/CompanyData.js";
import * as Messager from "~/App/Services/Messager.js";
import { AppContext } from "~/App/Context/AppContext.js";
import { WidgetContext } from "~/App/Context/WidgetContext";

import Loading from "~/App/Components/Loading/Loading.jsx";
import UILoading from "~/App/Components/UI/Loading/UILoading.jsx";
import Conversations from "~/App/Components/Conversations/Conversations.jsx";
import LabelledRange from "~/App/Components/UI/LabelledRange/LabelledRange.jsx";
import WidgetsHeader from "~/App/Components/Navigation/WidgetsHeader/WidgetsHeader.jsx";
import MeasureBounds from "~/App/Components/UI/Measure/MeasureBounds.jsx";


import "./Conversations.scss";

function ConversationsContainer({
    displayName = "",
    headerOffsets = {},
    navParams = {},
    conversationDays = 60,
    options = { showHeader: true },
    cache: parentCache,
}) {
    /**
     * Context
     */

    /**
     * State
     */
    const widgetContext = useContext(WidgetContext);
    const [
        { selectedProfile, viewLocked, selectedTeamUri = "", unaggregatedPeople },
        { setSelectedProfile, setViewLocked, /*setSelectedTeamUri,*/ setConversationSummaries },
    ] = widgetContext;
    const {
        initialConversationsData,
        initialFilteredConversations,
        initialLockedConversations,
        initialFilteredHeatmaps,
    } = useMemo(() => {
        const initialConversationsData = {
            apiState: apiStates.fetching,
            heatmaps: [],
            conversations: [],
            inboundOutboundByUser: {},
            inboundOutboundByContact: {},
        };
        const initialFilteredConversations = {
            filteredConversations: [],
            showFilteredConversations: false,
        };
        const initialLockedConversations = {
            lockedConversations: [],
            showLockedConversations: false,
        };
        const initialFilteredHeatmaps = {
            filteredHeatmaps: [],
            showFilteredHeatmaps: false,
        };

        return {
            initialConversationsData,
            initialFilteredConversations,
            initialLockedConversations,
            initialFilteredHeatmaps,
        };
    }, []);
    const [companyIdentity, setCompanyIdentity] = useState("");
    const [company, setCompany] = useState({});
    const [
        { apiState: conversationsApiState, data: conversationsData = {} },
        setConversationsData,
    ] = useState(initialConversationsData);
    const { heatmaps, conversations = [], inboundOutboundByUser, inboundOutboundByContact } = conversationsData;
    const [{ filteredConversations, showFilteredConversations }, setFilteredConversations] = useState(
        initialFilteredConversations,
    );
    const [{ lockedConversations, showLockedConversations }, setLockedConversations] = useState(
        initialLockedConversations,
    );
    const [{ filteredHeatmaps, showFilteredHeatmaps }, setFilteredHeatmaps] = useState(initialFilteredHeatmaps);
    const [conversationsBy, setConversationsBy] = useState(conversationDisplayTypes.user);
    const [currentDays, setCurrentDays] = useState(0);
    const cache = useMemo(() => parentCache ? parentCache : new LRU({ max: 500, maxAge: 1000 * 60 * 60 }), [parentCache]);
    const [height, setHeight] = useState(100);
    const updateHeight = useCallback(debounce(bounds => {
        setHeight(bounds.height);
    }, 50), []);

    /**
     * Refs
     */
    const todayRef = useRef(null);
    const scrollContainerRef = useRef(null);

    /**
     * Effects
     */
    // get company identity
    useEffect(() => {
        const { identity = "" } = navParams;
        const companyIdentity = decodeURIComponent(identity);
        setCompanyIdentity(companyIdentity);
        if (!companyIdentity) {
            setConversationsData({ apiState: apiStates.error, conversationsData: {} });
        }
    }, [navParams]);
    // get company data
    useEffect(() => {
        if (companyIdentity) {
            getCompanyByIdentity(companyIdentity, {}, { cache })
                .map(company => (company.uri ? company : throwError("No company found")))
                .fork(
                    err => {
                        setConversationsData({ apiState: apiStates.error, conversationsData: {} });
                        logger.error("Error getting company info", err);
                    },
                    company => {
                        setCompany(company);
                    },
                );
        }
    }, [cache, companyIdentity]);
    // get conversations settings
    useEffect(() => {
        getCurrentUserSettings({ fields: [currentUserSettingsKeys.conversationsDefaults].join(",") })
            .fork(err => {
                logger.error("Error getting current user settings", err);
            }, (currentUserSettings = {}) => {
                const conversationSettings = currentUserSettings[currentUserSettingsKeys.conversationsDefaults] || {};
                setCurrentDays(conversationSettings.conversationDays || conversationDays);
            });
    }, [conversationDays]);
    // get conversations data
    useEffect(() => {
        let cancelled = false;
        if (currentDays > 0) {
            if (unaggregatedPeople.apiState === apiStates.fetching) {
                setConversationsData(prev => ({ ...prev, apiState: apiStates.fetching }));
            } else if (unaggregatedPeople.apiState === apiStates.fetched) {
                formatCompanyTeamConversations(unaggregatedPeople.data)
                    .fork(
                        err => {
                            if (cancelled) return;
                            logger.error("Error getting conversations", err);
                            setConversationsData(({ ...initialConversationsData, apiState: apiStates.error }));
                        },
                        (conversations = []) => {
                            if (cancelled) return;
                            const {
                                heatmaps,
                                sortedConversations,
                                inboundOutboundByUser,
                                inboundOutboundByContact,
                            } = formatConversations(conversations, currentDays);
                            setConversationsData({
                                apiState: apiStates.fetched,
                                data: {
                                    heatmaps,
                                    conversations: sortedConversations,
                                    inboundOutboundByUser,
                                    inboundOutboundByContact,
                                }
                            });
                        },
                    );
            }
        }
        return () => {
            cancelled = true;
        };
    }, [currentDays, initialConversationsData, unaggregatedPeople.apiState, unaggregatedPeople.data]);
    // filter updates
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    }, [selectedTeamUri, scrollContainerRef]);
    // updates from other widgets
    useEffect(() => {
        if ((!!selectedProfile.uri && viewLocked) || (!selectedProfile.uri && !viewLocked)) {
            if (viewLocked) {
                const { type } = selectedProfile;
                const lockedConversations = conversations.reduce((acc, day) => {
                    const { conversations = [] } = day;
                    const conversationsWithPerson = conversations.filter(
                        ({ [type === "person" ? "contact" : "user"]: entity }) => {
                            return entity.uri === selectedProfile.uri;
                        },
                    );
                    if (conversationsWithPerson.length > 0) {
                        acc.push({
                            ...day,
                            ...getSortedConversations(conversationsWithPerson),
                        });
                    }
                    return acc;
                }, []);
                const today = todayRef.current || new Date();
                const filteredHeatmaps = generateInitialHeatmaps(today, currentDays + 1);
                lockedConversations.forEach(({ date, conversations, sortedConversations }) => {
                    const index = differenceInCalendarDays(today, date);
                    const value = filteredHeatmaps[index];
                    filteredHeatmaps[index] = {
                        ...value,
                        conversations,
                        sortedConversations,
                    };
                });
                const count = lockedConversations.reduce((count, { conversations = [] }) => {
                    count = count + conversations.length;
                    return count;
                }, 0);
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }
                setConversationSummaries({ count });
                setLockedConversations({ lockedConversations, showLockedConversations: true });
                setFilteredHeatmaps({ filteredHeatmaps, showFilteredHeatmaps: true });
            } else if (!selectedProfile.uri) {
                setLockedConversations(initialLockedConversations);
                setFilteredHeatmaps(initialFilteredConversations);
            }
        }
    }, [currentDays, conversations, initialFilteredConversations, initialLockedConversations, selectedProfile, viewLocked, setConversationSummaries]);
    const sendMessage = useMemo(
        () => (message, payload = {}) => {
            Messager.sendMessage(message, { ...payload });
        },
        [],
    );

    /**
     * Event handlers
     */
    const onUpdateConversationsBy = useCallback(event => {
        setConversationsBy(event.target.value);
    }, []);
    const onSelectConversationDays = useCallback(event => {
        const conversationDays = parseInt(event.target.value, 10);
        updateCurrentUserSettings({
            [currentUserSettingsKeys.conversationsDefaults]: { teamUri: selectedTeamUri, conversationDays: conversationDays }
        }).fork(err => logger.error(err), id);
        setCurrentDays(conversationDays);
    }, [selectedTeamUri]);
    const dbSetFilteredConversations = debounce(setFilteredConversations, 100);
    const lockView = person => event => {
        event.stopPropagation();
        setSelectedProfile(person);
        setViewLocked(true);
        sendMessage(Messager.messageTypes.lockView, { selectedPerson: person, viewLocked: true });
    };
    const unlockView = () => {
        setSelectedProfile({});
        setViewLocked(false);
        sendMessage(Messager.messageTypes.lockView, { selectedPerson: {}, viewLocked: false });
    };

    /**
     * Render
     */
    return (
        <div ref={scrollContainerRef} className="h-100 w-100 overflow-auto" style={{ paddingTop: headerOffsets.top }}>
            <div className="sticky w-100 z-1" style={{ top: 0 }}>
                <MeasureBounds updateBounds={updateHeight}>
                    {options.showHeader ? <WidgetsHeader navParams={navParams} displayName={displayName} company={company} cache={cache} options={{
                        showRecommendations: false,
                        showAccountRisks: false,
                        showRelationshipsSummary: false,
                        showConversationsSummary: true,
                    }} /> : <h1 className="mv0 f6 pv2 ph3 bg-white">Last Contact</h1>}
                    {company.uri && (
                        <div className="flex bg-near-white h2 ph3 items-center f7 fw5">
                            {conversations.length > 0 && (
                                <Fragment>
                                    <label htmlFor="user" className="flex items-center mr2">
                                        <span>By Teammate</span>
                                        <input
                                            id="user"
                                            name="byFilter"
                                            type="radio"
                                            value={conversationDisplayTypes.user}
                                            checked={conversationsBy === conversationDisplayTypes.user}
                                            onChange={onUpdateConversationsBy}
                                        />
                                    </label>
                                    <label htmlFor="contact" className="flex items-center mr4">
                                        <span>By Contact</span>
                                        <input
                                            id="contact"
                                            name="byFilter"
                                            type="radio"
                                            value={conversationDisplayTypes.contact}
                                            checked={conversationsBy === conversationDisplayTypes.contact}
                                            onChange={onUpdateConversationsBy}
                                        />
                                    </label>
                                    <div className="pv2 flex">
                                        <LabelledRange
                                            min={60}
                                            max={120}
                                            step={30}
                                            width={300}
                                            stepName="days"
                                            defaultValue={currentDays}
                                            onChange={onSelectConversationDays}
                                        />
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    )}
                </MeasureBounds>
            </div>
            {conversationsApiState === apiStates.fetching && isEmptyObject(conversationsData) ? (
                <Loading />
            ) : (
                    <div
                        className="conversations"
                        style={{ minHeight: `calc(98% - ${height}px)`, transition: `min-height .3s ease-in-out` }}
                        onClick={() => {
                            if (viewLocked) {
                                unlockView();
                            }
                        }}
                    >
                        <div className="h-100">
                            <section className={`pt2 relative ${conversationsApiState === apiStates.fetching ? "o-70" : ""}`}>
                                {conversationsApiState === apiStates.fetching && <UILoading className="absolute flex items-center justify-center h5 w-100 z-max" />}
                                {!company.uri ? (
                                    <div className="pt3 ph0 tc">
                                        No company found for {`"${companyIdentity}"`}.
                                        </div>
                                ) : conversations.length === 0 ? (
                                    <div className="pt3 ph0 tc">
                                        No activity found.
                                        </div>
                                ) : (
                                            <Conversations
                                                today={todayRef.current || new Date()}
                                                conversationDays={currentDays}
                                                conversationsBy={conversationsBy}
                                                conversations={
                                                    showFilteredConversations
                                                        ? filteredConversations
                                                        : showLockedConversations
                                                            ? lockedConversations
                                                            : conversations
                                                }
                                                inboundOutboundByUser={inboundOutboundByUser}
                                                inboundOutboundByContact={inboundOutboundByContact}
                                                heatmapValues={showFilteredHeatmaps ? filteredHeatmaps : heatmaps}
                                                heatmapOnMouseOver={(_, value) => {
                                                    const currentConversations = showLockedConversations
                                                        ? lockedConversations
                                                        : conversations;
                                                    const filteredConversations = currentConversations.filter(c =>
                                                        isSameDay(c.date, value.date),
                                                    );
                                                    if (!filteredConversations.length) {
                                                        filteredConversations.push({
                                                            date: value.date,
                                                            conversations: [],
                                                            sortedConversations: [],
                                                        });
                                                    }
                                                    dbSetFilteredConversations({ filteredConversations, showFilteredConversations: true });
                                                }}
                                                heatmapOnMouseLeave={() => {
                                                    dbSetFilteredConversations(initialFilteredConversations);
                                                }}
                                                onLock={lockView}
                                            />
                                        )}
                            </section>
                        </div>
                    </div>
                )
            }
        </div>
    );

}

const WrappedConversationsContainer = props => (
    <AppContext.Consumer>
        {appContext =>
            <WidgetContext.Consumer>
                {widgetContext =>
                    <ConversationsContainer appContext={appContext} widgetContext={widgetContext} {...props} />
                }
            </WidgetContext.Consumer>
        }
    </AppContext.Consumer>
);

export default WrappedConversationsContainer;
