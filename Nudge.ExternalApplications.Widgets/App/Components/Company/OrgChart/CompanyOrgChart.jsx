import React, { Fragment, useState, useCallback, useEffect, useMemo, useRef } from "react";
import LRU from "lru-cache";

import { once } from "@nudge/client-sdk/Util/fp/function";
import { apiStates } from "@nudge/client-sdk/Util/apiUtils";
import { id } from "@nudge/client-sdk/Util/fp/function";
import { throwError } from "@nudge/client-sdk/Util/fp/error";
import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { getTeamsAndSelectedTeam, aggregateTeamUris } from "@nudge/client-sdk/Data/Team/teamData";
import { currentUserSettingsKeys, updateCurrentUserSettings, getCurrentUserSettings } from "@nudge/client-sdk/Data/User/userData";
import { flaggedDataReason, flagProfileWithPrefixAndReason } from "@nudge/client-sdk/Data/Person/Metadata/flagData";

import { orgChartPrefix, orgChartFilters, useCompanyOrgData } from "@nudge/client-sdk/Components/Company/OrgChart/hooks";
import { OrgChart } from "@nudge/client-sdk/Components/Company/OrgChart/OrgChart";
import { OrgChartFilters } from "@nudge/client-sdk/Components/Company/OrgChart/OrgChartFilters";

import * as Messager from "~/App/Services/Messager.js";
import { AppContext } from "~/App/Context/AppContext.js";

import { getCompanyByIdentity } from "~/App/API/Company/CompanyData.js";
import Loading from "~/App/Components/Loading/Loading.jsx";
import UILoading from "~/App/Components/UI/Loading/UILoading.jsx";
import PersonProfile from "~/App/Components/Profile/Person/PersonProfile.jsx";
import TeamSelector from "~/App/Components/Teams/TeamSelector.jsx";
import ProfileImage from "~/App/Components/Profile/Image/ProfileImage.jsx";

import "./CompanyOrgChart.scss";


function CompanyOrgChart({
    displayName = "",
    headerOffsets = {},
    navParams = {},
    onFullScreen = () => {},
    history,
}) {
    /**
     * Context
     */
    const cache = useMemo(() => new LRU({ max: 500, maxAge: 1000 * 60 * 60 }), []);
    const [companyIdentity, setCompanyIdentity] = useState("");
    const [company, setCompany] = useState({});
    const [cellOpen, setCellOpen] = useState({});
    const [cellSelected, setCellSelected] = useState("");
    const [teamsData, setTeamsData] = useState({});
    const [selectedTeamUri, setSelectedTeamUri] = useState("");
    const [
        { companyMembers = {}, filters, flaggedUris = {} },
        { setCompanyMembers, setFilterByType, setFlaggedUris }
    ] = useCompanyOrgData(company.uri, selectedTeamUri, undefined, undefined, cache);
    const flagUri = useCallback((uri, reason = flaggedDataReason.general) => {
        setFlaggedUris(prev => ({ ...prev, [uri]: reason }));
        flagProfileWithPrefixAndReason(orgChartPrefix, reason)(uri)
            .fork(err => logger.error("Error updating flagged data", err), id);
    }, [setFlaggedUris]);
    const lastFilter = useRef();

    const { apiState: teamsApiState, teams = [] } = teamsData;
    const {
        apiState: companyMembersApiState,
        count,
        people: allPeople = [],
        allRoles,
        allRolesOrdering,
        filterCounts = {},
    } = companyMembers;
    const setFullScreen = useMemo(() => {
        return once(onFullScreen);
    }, [onFullScreen]);

    // get company identity
    useEffect(() => {
        const { identity = "" } = navParams;
        const companyIdentity = decodeURIComponent(identity);
        setCompanyIdentity(companyIdentity);
        if (!companyIdentity) {
            setCompanyMembers({ apiState: apiStates.error });
        }
    }, [navParams, setCompanyMembers]);

    // get company data
    useEffect(() => {
        if (companyIdentity) {
            getCompanyByIdentity(companyIdentity, {}, { cache })
                .map(company => (company.uri ? company : throwError("No company found")))
                .fork(
                    err => {
                        setCompanyMembers(prevCompanyMembers => ({ ...prevCompanyMembers, apiState: apiStates.error }));
                        logger.error(err);
                    },
                    company => {
                        setCompany(company);
                    },
                );
        }
    }, [companyIdentity, setCompanyMembers, cache]);

    // get teams data
    useEffect(() => {
        let cancelled = false;

        setTeamsData(prevTeamsData => ({ ...prevTeamsData, apiState: apiStates.fetching }));
        getTeamsAndSelectedTeam(currentUserSettingsKeys.orgChartDefaults, aggregateTeamUris.allTeamsAndCollabsUri.uri, { cache }).fork(
            err => {
                logger.error("Error getting teams", err);
                if (cancelled) return;
                setTeamsData(prevTeamsData => ({ ...prevTeamsData, apiState: apiStates.error }));
            },
            ({ selectedTeam, teams, userSettings = {} }) => {
                if (cancelled) return;
                setSelectedTeamUri(selectedTeam);
                setTeamsData({
                    apiState: apiStates.fetched,
                    teams: [{ uri: aggregateTeamUris.allTeamsAndCollabsUri.uri, teamName: "You & Collaborators" }, ...teams],
                });
                const orgChartSettings = userSettings[currentUserSettingsKeys.orgChartDefaults];
                if (orgChartSettings && orgChartSettings.initialFilter) {
                    setFilterByType(orgChartSettings.initialFilter);
                }
                lastFilter.current = orgChartFilters.initialFilter || orgChartFilters.hasTeamStrength;
            },
        );

        return () => (cancelled = true);
    }, [cache, setFilterByType]);

    // messages from other widgets
    useEffect(() => {
        return Messager.subscribe([Messager.messageTypes.selectTeam, Messager.messageTypes.lockView], handleMessage);
    }, [handleMessage]);

    /**
     * Callbacks and Memos
     */
    const handleMessage = useMemo(
        () => (message, payload = {}) => {
            switch (message) {
                case Messager.messageTypes.selectTeam: {
                    const { selectedTeam } = payload;
                    if (selectedTeam && selectedTeam !== selectedTeamUri) {
                        setSelectedTeamUri(selectedTeam);
                    }
                    break;
                }
                default:
                    break;
            }
        },
        [selectedTeamUri],
    );
    const sendMessage = useMemo(
        () => (message, payload = {}) => {
            Messager.sendMessage(message, { ...payload });
        },
        [],
    );

    const onSetFilter = (type = "") => () => {
        setFilterByType(type);
        setCellSelected("");
        if ([orgChartFilters.all, orgChartFilters.hasTeamStrength].includes(type)) {
            lastFilter.current = type;
            getCurrentUserSettings({ fields: currentUserSettingsKeys.orgChartDefaults })
                .fork(err => {
                    logger.error("Error getting current user settings", err);
                }, (currentUserSettings = {}) => {
                    const updateSettings = {
                        [currentUserSettingsKeys.orgChartDefaults]: {
                            ...(currentUserSettings[currentUserSettingsKeys.orgChartDefaults] || {}),
                            initialFilter: type,
                        }
                    };
                    updateCurrentUserSettings(updateSettings).fork(err => logger.error(err), id);
                });
        }
    };

    const onSelectTeam = (event = {}) => {
        const selectedTeam = (event.target && event.target.value) || "";
        setSelectedTeamUri(selectedTeam);
        setCellSelected("");
        setFilterByType(lastFilter.current);
        sendMessage(Messager.messageTypes.selectTeam, { selectedTeam });
        getCurrentUserSettings({ fields: [currentUserSettingsKeys.relationshipsDefaults, currentUserSettingsKeys.conversationsDefaults, currentUserSettingsKeys.orgChartDefaults].join(",") })
            .fork(err => {
                logger.error("Error getting current user settings", err);
            }, (currentUserSettings = {}) => {
                const updateSettings = {
                    [currentUserSettingsKeys.conversationsDefaults]: {
                        ...(currentUserSettings[currentUserSettingsKeys.conversationsDefaults] || {}),
                        teamUri: selectedTeam,
                    },
                    [currentUserSettingsKeys.relationshipsDefaults]: {
                        ...(currentUserSettings[currentUserSettingsKeys.relationshipsDefaults] || {}),
                        teamUri: selectedTeam,
                    },
                    [currentUserSettingsKeys.orgChartDefaults]: {
                        ...(currentUserSettings[currentUserSettingsKeys.orgChartDefaults] || {}),
                        teamUri: selectedTeam,
                    }
                };
                updateCurrentUserSettings(updateSettings).fork(err => logger.error(err), id);
            });
    };

    return companyMembersApiState === apiStates.fetching && allPeople.length === 0 ? (
        <Loading />
    ) : (
        <div
            className="companyOrgChart"
            style={{ paddingTop: headerOffsets.top, height: `calc(100vh - ${headerOffsets.top}px)` }}
        >
            <div className="relative flex items-center z-1 h3 ph3 bb b--black-10 outline-0">
                <section className="w-100 flex items-center bg-white z-1">
                    <h1 className="mv0 w4 f6 ph0 pv3">{displayName}</h1>
                    {company.uri && (
                        <Fragment>
                            {navParams.from && (
                                <a className="nudge-blue link pointer f6 mr3" onClick={() => history.goBack()}>
                                    ← Back
                                </a>
                            )}
                            <div className="flex items-center mr4">
                                <ProfileImage
                                    uid={company.name}
                                    alt={company.name}
                                    title={company.name}
                                    src={company.imageUrl}
                                    className="br4 pointer"
                                    size={30}
                                />
                                <span className="f6 ml2 fw6">{company.name}</span>
                            </div>
                            <div className="mr3">
                                <TeamSelector
                                    apiState={teamsApiState}
                                    teams={teams}
                                    NoTeams={() => "You & Collaborators"}
                                    selectedTeam={selectedTeamUri}
                                    onSelectTeam={onSelectTeam}
                                />
                            </div>
                            {filterCounts.all > 0 && <OrgChartFilters onSetFilter={onSetFilter} filters={filters} filterCounts={filterCounts} />}
                        </Fragment>
                    )}
                </section>
            </div>
            {allPeople.length === 0 ? (
                <div className="fixed absolute--fill flex items-center justify-center">
                    {!company.uri
                        ? `No company found for "${companyIdentity}".`
                        : `No relationships found.`}
                </div>
            ) : (
                <div
                    className="w-100 flex justify-center"
                    style={{ height: `calc(100vh - ${headerOffsets.top + 64}px)` }}
                >
                    <div className="companyOrgChart flex flex-column w-100">
                        {companyMembersApiState === apiStates.fetching && (
                            <UILoading className="absolute flex items-center justify-center h5 w-100 z-max" />
                        )}
                        <OrgChart
                            onScroll={setFullScreen}
                            apiState={companyMembersApiState}
                            count={count}
                            allRoles={allRoles}
                            allPeople={allPeople}
                            allRolesOrdering={allRolesOrdering}
                            cells={[cellSelected, setCellSelected]}
                            open={[cellOpen, setCellOpen]}
                            PersonProfile={PersonProfile}
                            cache={cache}
                            flaggedUris={flaggedUris}
                            flagUri={flagUri}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

const WrappedCompanyOrgChart = props => (
    <AppContext.Consumer>{appContext => <CompanyOrgChart appContext={appContext} {...props} />}</AppContext.Consumer>
);

export default WrappedCompanyOrgChart;
