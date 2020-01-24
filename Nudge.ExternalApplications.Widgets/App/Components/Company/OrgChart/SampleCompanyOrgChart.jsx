import React, { useState, useEffect, useMemo } from "react";
import LRU from "lru-cache";

import { apiStates, getEntity } from "@nudge/client-sdk/Util/apiUtils";
import { throwError } from "@nudge/client-sdk/Util/fp/error";
import { uniqBy, groupBy, uniq, traverse2 } from "@nudge/client-sdk/Util/fp/array";
import { entries } from "@nudge/client-sdk/Util/fp/object";
import { valuesToOrdering  } from "@nudge/client-sdk/Util/sortUtils";
import { compose, id } from "@nudge/client-sdk/Util/fp/function";
import { task } from "@nudge/client-sdk/Util/fp/Instances/Task";
import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
// import { useCompanyOrgData } from "@nudge/client-sdk/Components/Company/OrgChart/hooks";
import { NudgeUris } from "@nudge/client-sdk/Uris/NudgeUris";
import { roleToGroupName } from "@nudge/client-sdk/Data/Person/Role/jobRoleData";
import { jobLevelTypeToDisplay, byLevelDisplay } from "@nudge/client-sdk/Data/Person/Level/jobLevelData";

import { OrgChart } from "@nudge/client-sdk/Components/Company/OrgChart/OrgChart";

import { AppContext } from "~/App/Context/AppContext.js";

import { getCompanyByIdentity } from "~/App/API/Company/CompanyData.js";
import Loading from "~/App/Components/Loading/Loading.jsx";
import UILoading from "~/App/Components/UI/Loading/UILoading.jsx";
import PersonProfile from "~/App/Components/Profile/Person/PersonProfile.jsx";
import ProfileImage from "~/App/Components/Profile/Image/ProfileImage.jsx";



export const useCompanyOrgSampleData = (
    companyUri = "",
    cache,
    topRoleToShow = 20,
) => {
    const [companyMembers, setCompanyMembers] = useState({ apiState: apiStates.fetching });

    useEffect(() => {
        if (!companyUri) return;
        let cancelled = false;

        setCompanyMembers(prevCompanyMembers => ({ ...prevCompanyMembers, apiState: apiStates.fetching }));

        // get existing roles and levels for this company
        getEntity(NudgeUris.v2.people().count, {
            q: `company.uri:"${companyUri}" AND has:level AND has:roles AND NOT(level:"Unknown Level")`,
            by: `roles,level`,
            fields: `value,count`,
            limit: topRoleToShow,
        }, { cache })
            .map((roleLevels = []) => roleLevels.map(({ value }) => value.split(", ")))
            .map(splitRoleLevels => splitRoleLevels.map(([role, level]) => ({
                level,
                displayRole: roleToGroupName({ name: role }),
                displayLevel: jobLevelTypeToDisplay(level),
            })))
            .map(mappedRoleLevels => ({
                allRoles: uniq(mappedRoleLevels
                    .map(({ displayRole }) => displayRole)),
                people: compose(entries, groupBy(ps => ps.displayLevel))(mappedRoleLevels),
            }))
            .map(r => ({
                ...r,
                allRolesOrdering: valuesToOrdering(r.allRoles),
                people: r.people
                    .map(([displayLevel, displayRoles]) => [
                        displayLevel,
                        uniqBy(({ displayRole }) => displayRole)(displayRoles)
                            .map(({ displayRole, level }) => [displayRole, level])
                    ])
                    .sort(byLevelDisplay.contramap(([displayLevel]) => displayLevel).run)
            }))

            // for each role/level, get the titles
            .chain(r => traverse2(task)(id)(r.people
                .map(([displayLevel, displayRoles]) => 
                    traverse2(task)(
                        ([displayRole, level]) => getEntity(NudgeUris.v2.people().count, {
                            q: `company.uri:"${companyUri}" AND level:"${level}" AND roles.name:"${displayRole}"`,
                            by: `title`,
                            fields: `value,count`,
                        })
                        .map((titles = []) => [
                            displayLevel,
                            { [displayRole]: titles.map(({ value }, index) => ({ uri: `${displayLevel}_${displayRole}_${index}`, name: value, imageUrl: "emptystate_person" })) },
                        ])
                    )(displayRoles)
                ))
                .map(levelResults => levelResults
                    .map(levelResult => levelResult
                        .reduce((acc, [displayLevel, byRole]) => [displayLevel, { ...acc[1], ...byRole }], ["", {}])))
                .map(people => ({
                    ...r,
                    people,
                    count: people.reduce(
                        (acc, [_, rolesSummary]) =>
                            acc + entries(rolesSummary).reduce((acc, [_, people]) => acc + people.length, 0),
                        0,
                    )
                }))
            )
            
            .fork(
                err => {
                    logger.error("Error getting company members for org chart", err);
                    if (cancelled) return;
                    setCompanyMembers({ apiState: apiStates.error });
                },
                results => {
                    if (cancelled) return;
                    setCompanyMembers({ apiState: apiStates.fetched, ...results });
                },
            );

        return () => {
            cancelled = true;
        };
    }, [cache, companyUri, topRoleToShow]);

    return [companyMembers, setCompanyMembers];
};

function SampleCompanyOrgChart({
    displayName = "",
    headerOffsets = {},
    navParams = {},
}) {
    const cache = useMemo(() => new LRU({ max: 500, maxAge: 1000 * 60 * 60 }), []);
    const [companyIdentity, setCompanyIdentity] = useState("");
    const [company, setCompany] = useState({});
    const [cellOpen, setCellOpen] = useState({});
    const [cellSelected, setCellSelected] = useState("");
    const [companyMembers, setCompanyMembers] = useCompanyOrgSampleData(
        company.uri,
        cache,
    )

    const {
        apiState: companyMembersApiState,
        count,
        people: allPeople = [],
        allRoles,
        allRolesOrdering,
    } = companyMembers;

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
            getCompanyByIdentity(companyIdentity, { cache })
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

    return companyMembersApiState === apiStates.fetching && allPeople.length === 0 ? (
        <Loading />
    ) : (
        <div
            className="companyOrgChart"
            style={{ paddingTop: headerOffsets.top, height: `calc(100vh - ${headerOffsets.top}px)` }}
        >
            <div className="relative flex items-center z-1 h3 ph3 bb b--black-10 outline-0">
                <section className="w-100 flex items-center bg-white z-1">
                    <h1 className="mv0 w4 f5 ph0 pv3">{displayName}</h1>
                    {company.uri && (
                        <div className="flex items-center mr4">
                            <ProfileImage
                                uid={company.name}
                                alt={company.name}
                                title={company.name}
                                src={company.imageUrl}
                                className="br4 pointer"
                                size={30}
                            />
                            <span className="ml2 fw6">{company.name}</span>
                        </div>
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
                            apiState={companyMembersApiState}
                            count={count}
                            allRoles={allRoles}
                            allPeople={allPeople}
                            allRolesOrdering={allRolesOrdering}
                            cells={[cellSelected, setCellSelected]}
                            open={[cellOpen, setCellOpen]}
                            PersonProfile={PersonProfile}
                            ignoreTeamInteractions={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

const WrappedSampleCompanyOrgChart = props => (
    <AppContext.Consumer>{appContext => <SampleCompanyOrgChart appContext={appContext} {...props} />}</AppContext.Consumer>
);

export default WrappedSampleCompanyOrgChart;
