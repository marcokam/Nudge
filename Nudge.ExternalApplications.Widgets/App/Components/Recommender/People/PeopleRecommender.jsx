import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useTransition, useSpring, useChain, animated, config } from "react-spring";

import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { apiStates } from "@nudge/client-sdk/Util/apiUtils";
import { compose, id } from "@nudge/client-sdk/Util/fp/function";
import { propOr } from "@nudge/client-sdk/Util/fp/object";
import { uniqBy, filter } from "@nudge/client-sdk/Util/fp/array";
import { valuesToOrdering } from "@nudge/client-sdk/Util/sortUtils";
import { getTeamRecommendedNewContacts, RecommendationTypes } from "@nudge/client-sdk/Data/Person/Recommender/personRecommenderData";
import { getRolesForTeam } from "@nudge/client-sdk/Data/Person/Role/jobRoleData";
import { sortAndFilterIdentities } from "@nudge/client-sdk/Data/Identity/identityData";
import { aggregateTeamUris } from "@nudge/client-sdk/Data/Team/teamData";
import { getCurrentFlaggedData, getPrefixAndReason, flaggedDataReason, flagProfileWithPrefixAndReason } from "@nudge/client-sdk/Data/Person/Metadata/flagData";
import { orgChartPrefix } from "@nudge/client-sdk/Components/Company/OrgChart/hooks";

import { Tooltip } from "@nudge/client-sdk/Components/UI/Tooltip/Tooltip";
import { PersonSummary } from "@nudge/client-sdk/Components/Person/PersonSummary";
import { ExternalLink } from "@nudge/client-sdk/Components/UI/Link/ExternalLink";
import { Chevron } from "@nudge/client-sdk/Components/Icons/Chevron";
import { socialIcons } from "@nudge/client-sdk/Components/Icons/Social/icons";

import PersonProfile from "~/App/Components/Profile/Person/PersonProfile.jsx";


const getPersonId = personUri => personUri.replace(/\//g, "_");
const recommenderOpenKey = ("nudge-recommender-open-state");
let initialOpen = (sessionStorage && sessionStorage.getItem(recommenderOpenKey))
    ? sessionStorage.getItem(recommenderOpenKey) === "true"
    : true;

export default function PeopleRecommender({
    companyUri = "",
    teamUri = "",
    query,
    recommendationsToShow = 10,
    noRecommendations = "No recommendations to suggest",
    HeaderContent = () => null,
    cache,
}) {
    const [peopleData, setPeopleData] = useState({ apiState: apiStates.none         });
    const [open, setOpen] = useState(false);
    const setRecommendOpen = useCallback(open => {
        setOpen(open);
        if (sessionStorage) {
            sessionStorage.setItem(recommenderOpenKey, open);
            initialOpen = open;
        }
    }, []);
    const [flaggedUris, setFlaggedUris] = useState({});
    const flagUri = useCallback((uri, reason = flaggedDataReason.general) => {
        setFlaggedUris(prev => ({ ...prev, [uri]: reason }));
        flagProfileWithPrefixAndReason(orgChartPrefix, reason)(uri)
            .fork(err => logger.error("Error updating flagged data", err), id);
    }, [setFlaggedUris]);

    useEffect(() => {
        let cancelled = false;

        getCurrentFlaggedData()
            .map((response = []) => response
                .filter(d => !!(d.person1 && d.person1.uri) && getPrefixAndReason(d.note).prefix === orgChartPrefix)
                .map(d => ({ uri: (d.person1 && d.person1.uri) || "", note: d.note }))
                .reduce((acc, { uri, note }) => { acc[uri] = getPrefixAndReason(note).reason; return acc; }, {})
            )
            .fork(
                err => {
                    if (cancelled) return;
                    logger.error("Error getting flagged data", err);
                },
                flaggedUris => {
                    if (cancelled) return;
                    setFlaggedUris(flaggedUris);
                }
            );
    }, []);
    useEffect(() => {
        if (!companyUri || !teamUri) return;

        let cancelled = false;
        const teamUriToUse = teamUri === "collabs" ? aggregateTeamUris.allTeamsAndCollabsUri.uri : teamUri;
        setPeopleData(prevPeopleData => ({ ...prevPeopleData, apiState: apiStates.fetching }));

        getRolesForTeam(teamUriToUse, 5, undefined, { cache })
            .map((roles = []) => ({
                rolesQuery: `(${roles.map(r => `roles.name:"${r}"`).join(" OR ")})`,
                rolesOrdering: valuesToOrdering(roles),
            }))
            .chain(({ rolesQuery, rolesOrdering }) => getTeamRecommendedNewContacts(RecommendationTypes.company, teamUriToUse, companyUri, rolesQuery, rolesOrdering, cache))
            .map((people = []) => people.filter(p => flaggedUris[p.uri] !== flaggedDataReason.incorrectCompany)) 
            .fork(
                err => {
                    if (cancelled) return;
                    setPeopleData({ apiState: apiStates.error, people: [] });
                    logger.error("Error getting recommended people", err);
                },
                (people = []) => {
                    if (cancelled) return;
                    setPeopleData({
                        apiState: apiStates.fetched,
                        people: people.slice(0, recommendationsToShow),
                    });
                    if (people.length && initialOpen) {
                        setOpen(true);
                    }
                },
            );

        return () => {
            cancelled = true;
        };

    }, [cache, companyUri, flaggedUris, query, recommendationsToShow, teamUri]);

    const [ShowPersonSummary, setShowPersonSummary] = useState();
    const hideSummary = () => {
        setShowPersonSummary(null);
    };
    const showSummary = person => () => {
        setShowPersonSummary((_) => function ShowPersonSummary({ flaggedUris }) {
            return (
                <Tooltip targetSelector={`#${getPersonId(person.uri)}`} hide={hideSummary} className="bg-white z-5">
                    <span className="absolute pa3 pointer black-60 hover-bold f4" style={{ top: 0, right: 0 }} onClick={hideSummary}>✕</span>
                    <PersonSummary person={person} PersonProfile={PersonProfile} cache={cache} flaggedUris={flaggedUris} flagUri={(prefix, reason) => {
                        flagUri(prefix, reason);
                        if (reason === flaggedDataReason.incorrectCompany) {
                            hideSummary();
                        }
                    }} />
                </Tooltip>
            );
        });
    };

    const { apiState, people = [] } = peopleData;

    const collapsedHeight = 41;
    const expandedHeight = 185;
    const collapsedState = open && people.length && apiState !== apiStates.fetching;
    const springRef = useRef();
    const { maxHeight, transform, background } = useSpring({
        ref: springRef,
        config: config.default,
        from: { maxHeight: `${collapsedHeight}px`, transform: "rotate(0deg)", background: "#e8f5ff" },
        to: {
            maxHeight: collapsedState ? `${expandedHeight}px` : `${collapsedHeight}px`,
            transform: collapsedState ? "rotate(180deg)" : "rotate(0deg)",
            background: collapsedState ? "white" : "#e8f5ff",
        },
    });

    const transRef = useRef();
    const transitions = useTransition(collapsedState ? people : [], i => i.uri, {
        ref: transRef,
        unique: true,
        trail: 400 / people.length,
        from: { opacity: 0, transform: "scale(0)" },
        enter: { opacity: 1, transform: "scale(1)" },
        leave: { opacity: 0, transform: "scale(0)" },
    });

    useChain(collapsedState ? [springRef, transRef] : [transRef, springRef], [0, 0.1]);

    return (    
        <animated.div
            className="overflow-hidden black-80 bg-white bb b--black-10"
            style={{ maxHeight, background }}
        >
            {[apiStates.none, apiStates.fetching].includes(apiState) || people.length === 0 ? (
                <h1 className="flex items-center mv0 ph3 pv2 pb1 f6 fw4" style={{ height: collapsedHeight }}>
                    {[apiStates.none, apiStates.fetching].includes(apiState) ? "Calculating Recommendations..." : noRecommendations}
                </h1>
            ) : (
                <Fragment>
                    {ShowPersonSummary && <ShowPersonSummary flaggedUris={flaggedUris} />}
                    <div className="flex items-center ph3 pointer" onClick={() => setRecommendOpen(!open)}>
                        <h1 className="flex items-center mv0 pv2 pb1 f6" style={{ height: collapsedHeight }}>
                            <span className="mr3">Recommended Next Contacts ({people.length})</span>
                        </h1>
                        <animated.div style={{ transform }}>
                            <Chevron />
                        </animated.div>
                    </div>
                    <div className="flex">
                        <div className="pl3 pv1">
                            <HeaderContent />
                        </div>
                        <section className={`overflow-auto dt--fixed ${open ? "overflow-auto" : ""}`}>
                            <div className="dt-row flex bg1">
                                {transitions.map(({ item: person = {}, key, props } = {}) => {
                                    const {
                                        uri,
                                        name,
                                        title,
                                        identities = [],
                                        displayLevel = "",
                                        displayRoles = [],
                                        teamInteractions: {
                                            lastInboundTeamMember,
                                            lastOutboundTeamMember,
                                            lastMeetingTeamMember,
                                        } = {},
                                    } = person;
                                    const teamMembersWithContact = compose(
                                        ms => ms.slice(0, 1),
                                        uniqBy(p => p.uri),
                                    )(
                                        [lastInboundTeamMember, lastOutboundTeamMember, lastMeetingTeamMember]
                                            .filter(Boolean)
                                            .map(m => ({ ...m, type: "teams" })),
                                    );
                                    const identitiesWithData = compose(
                                        sortAndFilterIdentities,
                                        filter(compose(
                                            type => type !== "facebook",
                                            propOr("type", ""),
                                        ))
                                    )(identities.concat(teamMembersWithContact));
                                    const pillClass = "dib ph2 pv1 white-90 nowrap no-user-select";
                                    const levelColour = "bg-dark-green";
                                    const roleColor = "bg-purple";
                                    const flagged = !!flaggedUris[uri];
                                    const flaggedClass = flagged ? "bg-nudge-highlight-background" : "";

                                    return (
                                        <animated.div key={key} id={getPersonId(person.uri)} style={{ ...props }} className={`dtc v-top pa2 br b--black-10 pointer ${flaggedClass}`} onClick={showSummary(person)}>
                                            <div className="flex items-center">
                                                <div className="dt--fixed" style={{ width: "auto", minHeight: 20 }}>
                                                    {identitiesWithData.map(({ uri, name, type, identity, externalUrl }) => {
                                                        const iconProps = socialIcons[type] || {};
                                                        const Icon = iconProps.icon;
                                                        return type !== "teams"
                                                            ? (
                                                                <ExternalLink
                                                                    key={identity}
                                                                    href={externalUrl}
                                                                    className="dtc v-mid pr2 link dark-gray f7 dib"
                                                                    title={
                                                                        type === "twitter"
                                                                            ? `@${identity}`
                                                                            : identity
                                                                    }
                                                                >
                                                                    <Icon style={iconProps.style} />
                                                                </ExternalLink>
                                                            ) : (
                                                                <a
                                                                    key={uri}
                                                                    className="dtc v-mid pr2 link dark-gray f7 dib pointer"
                                                                    title={`Previous contact with ${name}`}
                                                                >
                                                                    <Icon style={iconProps.style} />
                                                                </a>
                                                            );
                                                    })}
                                                </div>
                                                <PersonProfile uri={uri} name={name} title={title} className="w4" />
                                            </div>
                                            <div className="mt2 f7">
                                                {displayLevel && (
                                                    <span className={`${pillClass} ${levelColour}`}>{displayLevel}</span>
                                                )}
                                                {displayRoles.length > 0 &&
                                                    displayRoles.map(role => (
                                                        <span key={`${uri}-${role}`} className={`${pillClass} ${roleColor}`}>
                                                            {role}
                                                        </span>
                                                    ))}
                                            </div>
                                        </animated.div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </Fragment>
            )}
        </animated.div>
    );
}
