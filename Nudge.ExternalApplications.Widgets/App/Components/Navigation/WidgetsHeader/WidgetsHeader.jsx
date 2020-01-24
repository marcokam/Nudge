import React, { Fragment, useMemo, useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { Transition, animated } from "react-spring/renderprops";

import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { id } from "@nudge/client-sdk/Util/fp/function";
import { isEmptyObject } from "@nudge/client-sdk/Util/ObjectUtils";
import { apiStates, getAllEntities } from "@nudge/client-sdk/Util/apiUtils";
import { NudgeUris } from "@nudge/client-sdk/Uris/NudgeUris";
import { uriToId } from "@nudge/client-sdk/Uris/uriUtils";
import { nameToInitials, simplePlural } from "@nudge/client-sdk/Util/nameUtils";
import { getTeamsAndSelectedTeam, aggregateTeamUris } from "@nudge/client-sdk/Data/Team/teamData";
import { currentUserSettingsKeys, getCurrentUserSettings, updateCurrentUserSettings, hasValidLicenses } from "@nudge/client-sdk/Data/User/userData";

import { OrgIcon } from "@nudge/client-sdk/Components/Icons/OrgIcon";
import { RelationshipSparkline } from "@nudge/client-sdk/Components/Relationships/RelationshipSparkline";
import { AccountRisk } from "@nudge/client-sdk/Components/Company/AccountRisk/AccountRisk";
import NudgeLink from "@nudge/client-sdk/Components/UI/Link/NudgeLink";

import { WidgetContext } from "~/App/Context/WidgetContext.js";
import * as Messager from "~/App/Services/Messager.js";
import { personUrl } from "~/App/API/Person/PersonAPI.js";

import TeamSelector from "~/App/Components/Teams/TeamSelector.jsx";
import PeopleRecommender from "~/App/Components/Recommender/People/PeopleRecommender.jsx";
import PersonProfile from "~/App/Components/Profile/Person/PersonProfile.jsx";
import ProfileImage from "~/App/Components/Profile/Image/ProfileImage.jsx";


const WidgetsHeader = ({ navParams = {}, company = {}, teamUri = "", maxConversationDays = 120, cache, options = {
    showRecommendations: false,
    showAccountRisk: false,
    showRelationshipsSummary: false,
    showConversationsSummary: false,
} }) => {
    const { identity, mode } = navParams;
    const { initialTeamsData } = useMemo(() => {
        const initialTeamsData = { apiState: apiStates.fetching, teams: [] };
        return { initialTeamsData };
    }, []);
    const [{ apiState: teamsApiState, teams }, setTeamsData] = useState(initialTeamsData);
    const widgetContext = useContext(WidgetContext);
    const [
        { selectedProfile, viewLocked, relationshipSummaries = {}, conversationSummaries = {}, selectedTeamUri = "", unaggregatedPeople },
        { setSelectedProfile, setViewLocked, setSelectedTeamUri, setUnaggregatedPeople },
    ] = widgetContext;
    const {
        type: profileType = "",
        uri: profileUri = "",
        name: profileName = "",
        imageUrl: profileImage = "",
    } = selectedProfile;
    const prefixedUri = profileType === "user" ? profileUri ? `/team${profileUri}` : "" : profileUri;
    const { [prefixedUri || "allRelationships"]: summaryRelationships = {} } = relationshipSummaries;
    const {
        total = 0,
        ["Very Strong"]: veryStrong = 0,
        ["Strong"]: strong = 0,
        ["Medium"]: medium = 0,
        ["Weak"]: weak = 0,
        ["Very Weak"]: veryWeak = 0,
    } = summaryRelationships;
    const summaryTitle = ["Very Strong", "Strong", "Medium", "Weak", "Very Weak"]
        .filter(name => !!summaryRelationships[name])
        .map(name => `${name}: ${summaryRelationships[name] || 0}`)
        .join(" • ");
    const summaryName = profileName || company.name;
    const summaryImage = profileImage || company.imageUrl;
    const summaryType = profileUri ? "person" : "company";
    const profileHref = personUrl(profileUri);
    const { count: conversationsCount } = conversationSummaries;
    const talkingToType = profileType === "person" ? "teammate" : "contact";
    const unlockView = () => {
        setViewLocked(false);
        setSelectedProfile({});
        sendMessage(Messager.messageTypes.lockView, { selectedPerson: {}, viewLocked: false });
    };

    // get teams data
    useEffect(() => {
        let cancelled = false;
        getTeamsAndSelectedTeam(currentUserSettingsKeys.relationshipsDefaults, aggregateTeamUris.allTeamsAndCollabsUri.uri, { cache }).fork(
            err => {
                logger.error("Error getting teams", err);
                if (cancelled) return;
                setTeamsData(prevTeamsData => ({ ...prevTeamsData, apiState: apiStates.error }));
            },
            ({ selectedTeam, teams }) => {
                if (cancelled) return;
                setSelectedTeamUri(teamUri || selectedTeam);
                setTeamsData({
                    apiState: apiStates.fetched,
                    teams: [{ uri: aggregateTeamUris.allTeamsAndCollabsUri.uri, teamName: "You & Collaborators" }].concat(teams),
                });
            },
        );
        return () => (cancelled = true);
    }, [cache, onSelectTeam, setSelectedTeamUri, teamUri]);

    // get unaggregated data
    useEffect(() => {
        if (!company.uri || !selectedTeamUri) return;

        let cancelled = false;

        setUnaggregatedPeople(prev => ({ ...prev, apiState: apiStates.fetching }));
        getAllEntities(NudgeUris.v2.people()._uri, {
            limit: 99,
            fields: `uri,name,title,imageUrl,level,roles,teamInteractions(strength,maxStrength,strengthTeamMember,lastInbound,lastInboundTeamMember(uri,name,title,imageUrl),lastOutbound,lastOutboundTeamMember(uri,name,title,imageUrl),lastMeeting,lastMeetingTeamMember(uri,name,title,imageUrl),nextMeeting,nextMeetingTeamMember(uri,name,title,imageUrl))`,
            q: `company.uri:"${company.uri}" AND (teamInteractions.strength:[veryWeak TO veryStrong] OR teamInteractions.now_lastInbound:[0 TO ${maxConversationDays}] OR teamInteractions.now_lastOutbound:[0 TO ${maxConversationDays}] OR teamInteractions.now_lastMeeting:[0 TO ${maxConversationDays}])`,
            team: selectedTeamUri,
            aggregation: "none",
            hint: "analytics",
        }, { cache }).fork(
            err => {
                if (cancelled) return;
                logger.error("Error getting unaggregated people", err);
                setUnaggregatedPeople(prev => ({ ...prev, apiState: apiStates.error }));
            },
            data => {
                if (cancelled) return;
                setUnaggregatedPeople({ apiState: apiStates.fetched, data });
            });
        return () => {
            cancelled = true;
        };
    }, [cache, company.uri, maxConversationDays, selectedTeamUri, setUnaggregatedPeople]);
    
    // messages from other widgets
    useEffect(() => {
        return Messager.subscribe([Messager.messageTypes.selectTeam, Messager.messageTypes.lockView], handleMessage);
    }, [handleMessage]);
    
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
                case Messager.messageTypes.lockView: {
                    const { selectedPerson: nextSelectedProfile = {}, viewLocked: nextViewLocked } = payload;
                    if (nextSelectedProfile && nextSelectedProfile.uri !== selectedProfile.uri) {
                        setViewLocked(nextViewLocked);
                        setSelectedProfile(nextSelectedProfile);
                    } else {
                        setViewLocked(false);
                        setSelectedProfile({});
                    }
                    break;
                }
                default:
                    break;
            }
        },
        [selectedProfile.uri, selectedTeamUri, setSelectedProfile, setSelectedTeamUri, setViewLocked],
    );
    const sendMessage = useMemo(
        () => (message, payload = {}) => {
            Messager.sendMessage(message, { ...payload });
        },
        [],
    );

    const onSelectTeam = useCallback(
        event => {
            const selectedTeam = (event.target && event.target.value) || "";
            setSelectedTeamUri(selectedTeam);
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
        },
        [sendMessage, setSelectedTeamUri],
    );

    return (
        <Fragment>
            <div
                className="h3-ns ph3 relative flex flex-row-ns flex-column items-center z-1 bg-white bb b--black-10 outline-0"
                tabIndex="-1"
                style={{ top: 0 }}
            >
                {(company.uri) && (
                    <Fragment>
                        <Transition
                            native
                            config={{ tension: 300, friction: 30 }}
                            items={!!selectedProfile.uri && viewLocked}
                            from={{ transform: "translateY(-100%)", opacity: 0 }}
                            enter={{ transform: "translateY(0)", opacity: 1 }}
                            leave={{ transform: "translateY(-100%)", opacity: 0 }}
                        >
                            {show =>
                                show &&
                                function ActionMenu(props) {
                                    return (
                                        <animated.div
                                            className="absolute absolute--fill flex items-center bg-nudge-blue white pointer"
                                            style={{ ...props }}
                                            onClick={unlockView}
                                        >
                                            <span className="flex items-center f4 ph3">×</span>
                                            {profileHref && selectedProfile.uri && (
                                                <div className="flex flex-column flex-row-ns justify-center items-center">
                                                    <NudgeLink
                                                        className="link white f7 mw5"
                                                        to={profileHref}
                                                    >
                                                        <PersonProfile
                                                            uri={selectedProfile.uri}
                                                            name={selectedProfile.name}
                                                            title={selectedProfile.title}
                                                            imageUrl={selectedProfile.imageUrl}
                                                            size={35}
                                                            className="mv0"
                                                        />
                                                        <div className="underline" style={{ paddingLeft: 35 + 8 }}>
                                                            View Profile
                                                        </div>
                                                    </NudgeLink>
                                                    <div className="mh3 f7">
                                                        <div className="mv1">
                                                            {options.showRelationshipsSummary && <Fragment>
                                                                <span>Relationships:</span>
                                                                <span className="ml1 w2">
                                                                    {total}
                                                                </span>
                                                            </Fragment>}
                                                            {options.showConversationsSummary && <Fragment>
                                                                <span className="ml3">Talking to:</span>
                                                                <span className="ml1 w3">
                                                                    {conversationsCount}{" "}
                                                                    {simplePlural(conversationsCount, talkingToType)}
                                                                </span>
                                                            </Fragment>}
                                                        </div>
                                                        {options.showRelationshipsSummary && <div title={summaryTitle}>
                                                            <RelationshipSparkline
                                                                width={215}
                                                                height={10}
                                                                data={{ total, veryStrong, strong, medium, weak, veryWeak }}
                                                            />
                                                            <div className="truncate mv1">{summaryTitle}</div>
                                                        </div>}
                                                    </div>
                                                </div>
                                            )}
                                        </animated.div>
                                    );
                                }
                            }
                        </Transition>
                        <div className="flex justify-center items-center h3-ns mr4-ns f6">
                            <TeamSelector
                                apiState={teamsApiState}
                                teams={teams}
                                NoTeams={() => "You & Collaborators"}
                                selectedTeam={selectedTeamUri}
                                onSelectTeam={onSelectTeam}
                            />
                        </div>

                        <div className="flex flex-column justify-center h3-ns mr4-ns">
                            <div className="flex items-center">
                                {summaryImage && !viewLocked && (
                                    <Fragment>
                                        <ProfileImage
                                            uid={summaryName}
                                            alt={
                                                summaryType === "person"
                                                    ? summaryName
                                                    : nameToInitials(summaryName.slice(0, 1))
                                            }
                                            title={summaryName}
                                            src={summaryImage}
                                            className={`pointer mh0 ${
                                                summaryType === "person" ? "br-100" : "br1"
                                                }`}
                                            size={30}
                                        />
                                        <span className="f6 ml2">{summaryName}</span>
                                    </Fragment>
                                )}
                            </div>
                            {options.showRelationshipsSummary && !isEmptyObject(summaryRelationships) && <div className="flex items-center f7 mv1">
                                <div className="flex flex-column">
                                    <div className="flex">
                                        <span>Relationships:</span>
                                        <span className="ml1 w2">
                                            {total}
                                        </span>
                                    </div>
                                </div>
                                <div title={summaryTitle}>
                                    <RelationshipSparkline
                                        width={80}
                                        height={10}
                                        data={{ total, veryStrong, strong, medium, weak, veryWeak }}
                                    />
                                </div>
                            </div>}
                        </div>
                        {options.showAccountRisk && <AccountRisk apiState={unaggregatedPeople.apiState} people={unaggregatedPeople.data} />}
                    </Fragment>)}
            </div>

            {hasValidLicenses().getOrElse(() => false) &&
                options.showRecommendations &&
                company.uri &&
                uriToId(company.uri)
                    // eslint-disable-next-line react/display-name
                    .map(_ => ({ hideIcon = false }) => (
                        <Link
                            className="nudge-blue link f6 flex flex-column items-center justify-center pr2"
                            key="orgChartLink"
                            to={`/orgChart?identity=${identity}&from=relationships${mode ? `&mode=${mode}` : ``}`}
                        >
                            {!hideIcon && (
                                <span className="mb2">
                                    <OrgIcon />
                                </span>
                            )}
                            <span className="flex items-center pv1 ph3 bn white-90 bg-nudge-blue nowrap">
                                Explore all contacts
                            </span>
                        </Link>
                    ))
                    .map(OrgChartLink => (
                        <div key="peopleRecommender" className="bg-white">
                            <PeopleRecommender
                                companyUri={company.uri}
                                teamUri={selectedTeamUri}
                                noRecommendations={
                                    <div className="flex items-center">
                                        <OrgChartLink hideIcon={true} />
                                        <span className="ml2">No recommendations to suggest</span>
                                    </div>
                                }
                                HeaderContent={OrgChartLink}
                                cache={cache}
                            />
                        </div>
                    ))
                    .getOrElse(() => null)}
        </Fragment>
    );
};


const WrappedWidgetsHeader = props => (
    <WidgetContext.Consumer>
        {widgetContext => <WidgetsHeader widgetContext={widgetContext} {...props} />}
    </WidgetContext.Consumer>
);

export default WrappedWidgetsHeader;