import { useState, useEffect, useCallback, useMemo } from "react";

import { IJobRole, Person, IUserFlaggedData } from "~/Data/NudgeInterfaces";

import { Task } from "~/Util/fp/Instances/Task";
import NudgeIterable from "~/Util/NudgeIterable";
import { Compare } from "~/Util/fp/Instances/Compare";
import { NudgeUris } from "~/Uris/NudgeUris";
import { allPass, compose } from "~/Util/fp/function";
import { optHead, groupBy, uniq } from "~/Util/fp/array";
import { optProp, mapEntries, entries, propOr } from "~/Util/fp/object";
import { tryCatch, option } from "~/Util/fp/Instances/Option";
import { getEntity, apiStates, ApiStates } from "~/Util/apiUtils";
import {
    numCompareByDir,
    truthyCompareByDir,
    valuesToOrdering,
    sortValueLast,
} from "~/Util/sortUtils";
import * as logger from "~/Logging/DefaultLogger";
import { roleToGroupName, getRolesForTeam, byRoleGroupName, rolesToRoleGroups } from "~/Data/Person/Role/jobRoleData";
import { jobLevelTypeToDisplay, JobLevelDisplay, byLevelDisplay } from "~/Data/Person/Level/jobLevelData";
import {
    RelationshipStrength,
    strengthToOrdering,
    hasTeamStrength,
    hasStrongTeamRelationship,
    hasWeakTeamRelationship,
    isWeakenedTeamRelationship,
    isSlippingTeamRelationship,
    newExec,
    relationshipRisks,
} from "~/Data/Person/Relationship/relationshipData";
import { getCurrentFlaggedData, getPrefixAndReason, flaggedDataReason, FlaggedDataReason } from "~/Data/Person/Metadata/flagData";


interface ComputedRelationship {
    displayRoles: string[];
    strength: RelationshipStrength;
    maxStrength: RelationshipStrength;
    hasTeamInteraction: boolean;
    strengthValue: number;
    firstRole: string;
    displayLevel: JobLevelDisplay;
    risks: {
        lastCommunication: Date;
        lastCommDisplay: string;
        slipping: boolean;
        weakened: boolean;
        singleThreaded: boolean;
        notStrong: boolean;
        riskCount: boolean;
        exec: boolean;
        strong: boolean;
        active: boolean;
    };
}
export type OrgChartPerson = Person & ComputedRelationship;
export interface ByRole {
    [k: string]: OrgChartPerson[];
}
interface CompanyMembers {
    apiState: keyof ApiStates;
    allPeople: Person[];
};
export type ByLevelByRole = [JobLevelDisplay, ByRole][];

const anyPerson = (_: Person) => true;

const initialFilters = {
    all: false,
    hasTeamStrength: false,
    hasStrongRelationship: false,
    hasWeakRelationship: false,
    weakened: false,
    newExecs: false,
    slipping: false,
    missingRoles: false,
}
export const orgChartFilters = {
    all: "all",
    hasTeamStrength: "hasTeamStrength",
    hasStrongRelationship: "hasStrongRelationship",
};
export const orgChartPrefix = `#OrgChart`;
export const useCompanyOrgData = (
    companyUri = "",
    teamUri = "",
    initialFilter = orgChartFilters.hasTeamStrength,
    filterFn = anyPerson,
    cache?: any,
    topRoleToShow = 10,
    maxRecords = 999,
) => {
    const [companyMembers, setCompanyMembers] = useState({ apiState: apiStates.fetching });
    const [flaggedUris, setFlaggedUris] = useState({} as unknown as Record<string,FlaggedDataReason>);
    const [filters, setFilters] = useState({ ...initialFilters, [initialFilter]: true });
    const setFilterByType = useCallback((filterType: string) => {
        setFilters({
            ...initialFilters,
            [filterType]: true,
        })
    }, [setFilters]);
    const interactionsToUse = useMemo(() => teamUri ? "teamInteractions" : "interactions", [teamUri]);

    useEffect(() => {
        let cancelled = false;

        getCurrentFlaggedData()
            .map((response: IUserFlaggedData[] = []) => response
                .filter(d => !!(d.person1 && d.person1.uri) && getPrefixAndReason(d.note).prefix === orgChartPrefix)
                .map(d => ({ uri: (d.person1 && d.person1.uri) || "", note: d.note }))
                .reduce((acc, { uri, note }) => { acc[uri] = getPrefixAndReason(note).reason; return acc; }, {} as unknown as Record<string, FlaggedDataReason>)
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

        return () => {
            cancelled = true;
        }
    }, []);

    useEffect(() => {
        if (!companyUri || !teamUri) return;
        let cancelled = false;

        setCompanyMembers(prevCompanyMembers => ({ ...prevCompanyMembers, apiState: apiStates.fetching }));


        Task.of({
            q: `company.uri:"${companyUri}"`,
            fields: `uri,name,title,imageUrl,level,roles,${interactionsToUse}`,
            team: teamUri,
        })
            .chain(queryOptions => 
                getRolesForTeam(teamUri, topRoleToShow, undefined, { cache })
                    // generate the query that will be used to get people later based on the roles found
                    .map((roles = []) => ({
                        rolesOrdering: valuesToOrdering(roles),
                        query: {
                            ...queryOptions,
                            // people in the company, either in a role that the team sells to or someone they've previously communicated with
                            q: `${queryOptions.q} AND ((has:level AND NOT(level:unknown) AND NOT(level:"") AND has:roles AND (${roles
                                .map(r => `roles.name:"${r}"`)
                                .join(" OR ")})) OR has:${interactionsToUse}.lastInbound OR has:${interactionsToUse}.lastOutbound OR has:${interactionsToUse}.lastMeeting)`,
                        }
                    })))
            

            // get a count of the people that will be returned by the query
            .chain(({ rolesOrdering, query }) =>
                getEntity(NudgeUris.v2.people().count, query, { cache })
                    .map((results: { count: number }[]) => optHead(results)
                        .chain(optProp("count"))
                        .getOrElse(() => 0))
                    .map(count => ({
                        compareByRoleGroup: byRoleGroupName(rolesOrdering),
                        count,
                        query,
                    })))

            // use the count to limit the people query
            .chain(({ compareByRoleGroup, count, query }) =>
                getEntity(
                    NudgeUris.v2.people()._uri,
                    { ...query, limit: Math.min(count as number, maxRecords) },
                    { cache },
                )
                    // filter any people that were flagged with incorrectCompany
                    .map((people: Person[] = []) => people.filter(p => flaggedUris[p.uri] !== flaggedDataReason.incorrectCompany))
                    // calculate some values that we will need for each person, and make sure they have defaults
                    .map((people: Person[]) =>
                        people
                            // teamInteractions might be empty
                            .map(
                                p =>
                                    (({
                                        ...p,
                                        teamInteractions: teamUri ? p.teamInteractions : p.interactions,
                                        ...tryCatch(() => teamUri ? p.teamInteractions : p.interactions)
                                            .map(
                                                ({
                                                    strength = RelationshipStrength.none,
                                                    maxStrength = RelationshipStrength.none,
                                                    lastInbound = "",
                                                    lastOutbound = "",
                                                    lastMeeting = "",
                                                }) => ({
                                                    strength,
                                                    maxStrength,
                                                    strengthValue: strengthToOrdering(strength),
                                                    hasTeamInteraction:
                                                        !!lastInbound || !!lastOutbound || !!lastMeeting,
                                                }),
                                            )
                                            .getOrElse(() => ({
                                                strength: RelationshipStrength.none,
                                                maxStrength: RelationshipStrength.none,
                                                strengthValue: 0,
                                                hasTeamInteraction: false,
                                            })),
                                        ...{
                                            firstRole: tryCatch(() => p.roles)
                                                .map((roles: IJobRole[]) =>
                                                    roles.map(roleToGroupName).sort(compareByRoleGroup.run),
                                                )
                                                .chain((roles: string[]) => optHead(roles))
                                                .getOrElse(() => "Unknown"),
                                            displayLevel: jobLevelTypeToDisplay(p.level),
                                            displayRoles: tryCatch(() => p.roles)
                                                .map(roles => rolesToRoleGroups(roles).sort(compareByRoleGroup.run))
                                                .getOrElse(() => []),
                                            risks: relationshipRisks(p),
                                        },
                                    } as unknown) as OrgChartPerson),
                            )
                            // for each level/role, we want to highlight people where the team has had some
                            //   previous relationship, and also show highest current strength first
                            .sort(byLevelDisplay
                                .contramap((p: OrgChartPerson) => p.displayLevel)
                                .concat(Compare.of(numCompareByDir(false))
                                    .contramap((p: OrgChartPerson) => p.strengthValue)
                                    .concat(Compare.of(truthyCompareByDir(false))
                                        .contramap((p: OrgChartPerson) => p.hasTeamInteraction)))
                                .run
                            ),
                    )
                    .map(people => ({
                        people,
                        duplicates: compose(
                            (entries: [string, Person[]][]) => NudgeIterable.fromArray(entries)
                                .filter(([_, dups]) => dups.length > 1)
                                .flatMap(([_, dups]) => NudgeIterable.fromArray(dups.slice(1)))
                                .toArray(),
                            entries,
                            groupBy((p: Person & { firstRole: string }) => `${p.firstRole}_${p.level}_${p.name}`)
                        )(people),
                    }))
                    .map(({ people = [], duplicates }) => option.of(duplicates)
                        .map(duplicates => duplicates.map(propOr("uri", "")))
                        .map(dupUris => people.filter(({ uri }) => !dupUris.includes(uri)))
                        .getOrElse(() => people))
                    .map(people => ({
                        filteredPeople: people.filter(allPass([
                            filterFn,
                            filters.hasTeamStrength ? hasTeamStrength.run : anyPerson,
                            filters.hasStrongRelationship ? hasStrongTeamRelationship.run : anyPerson,
                            filters.hasWeakRelationship ? hasWeakTeamRelationship.run : anyPerson,
                            filters.weakened ? isWeakenedTeamRelationship.run : anyPerson,
                            filters.slipping ? isSlippingTeamRelationship().run : anyPerson,
                            filters.newExecs ? newExec() : anyPerson,
                        ])),
                        filterCounts: people.reduce((filterCounts, p) => {
                            if (hasTeamStrength.run(p)) filterCounts.hasTeamStrength++;
                            if (hasStrongTeamRelationship.run(p)) filterCounts.hasStrongRelationship++;
                            if (hasWeakTeamRelationship.run(p)) filterCounts.hasWeakRelationship++;
                            if (isWeakenedTeamRelationship.run(p)) filterCounts.weakened++;
                            if (isSlippingTeamRelationship().run(p)) filterCounts.slipping++;
                            if (newExec()(p)) filterCounts.newExecs++;
                            return filterCounts;
                        }, {
                            all: people.length,
                            hasTeamStrength: 0,
                            hasStrongRelationship: 0,
                            hasWeakRelationship: 0,
                            weakened: 0,
                            slipping: 0,
                            newExecs: 0,
                        }),
                    }))
                    .map(({ filteredPeople, filterCounts }) => ({
                        // group people by their display level
                        byLevel: groupBy((p: Person) => jobLevelTypeToDisplay(p.level))(filteredPeople),
                        // also get all the unique first roles for this list of people, order it by most team relationships (previously fetched)
                        allRoles: uniq(filteredPeople.map((p: OrgChartPerson) => p.firstRole)).sort(compareByRoleGroup.run),
                        filterCounts,
                        flaggedUris,
                    })),
            )

            // for each level, group people by their first role
            .map(({ byLevel, allRoles, filterCounts, flaggedUris }) => ({
                people: mapEntries((level, people): [JobLevelDisplay, ByRole] => [
                    level as JobLevelDisplay,
                    groupBy<OrgChartPerson>(p => p.firstRole)(people as OrgChartPerson[]),
                ])(byLevel as Record<string, OrgChartPerson[]>),
                allRoles: allRoles.sort(sortValueLast("Unknown", true)),
                filterCounts,
                flaggedUris,
            }))

            // assemble the final results
            .map(({ people, allRoles, filterCounts, flaggedUris }) => ({
                count: (people as [JobLevelDisplay, ByRole][]).reduce(
                    (acc, [_, rolesSummary]) =>
                        acc + entries(rolesSummary)
                            .reduce((acc, [_, people]) => acc + people.length, 0),
                    0,
                ),
                people,
                allRoles,
                allRolesOrdering: valuesToOrdering(allRoles),
                filterCounts,
                flaggedUris,
            }))

            .fork(
                err => {
                    logger.error("Error getting company members for org chart", err);
                    if (cancelled) return;
                    setCompanyMembers({ apiState: apiStates.error });
                },
                (results) => {
                    if (cancelled) return;
                    setCompanyMembers({ apiState: apiStates.fetched, ...results });
                },
            );

        return () => {
            cancelled = true;
        };
    }, [companyUri, teamUri, filterFn, filters, cache, topRoleToShow, maxRecords, interactionsToUse, flaggedUris]);

    return [{ companyMembers, filters, flaggedUris }, { setCompanyMembers, setFilterByType, setFlaggedUris }];
};