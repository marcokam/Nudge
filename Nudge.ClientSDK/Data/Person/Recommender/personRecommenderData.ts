import { Person, IPersonIdentity, Interactions } from "~/Data/NudgeInterfaces";
import { OrgChartPerson } from "~/Components/Company/OrgChart/hooks";

import { numCompareByDir, truthyCompareByDir, Ordering } from "~/Util/sortUtils";
import { option } from "~/Util/fp/Instances/Option";
import { jobLevelToOrdering, jobLevelTypeToDisplay, JobLevel } from "~/Data/Person/Level/jobLevelData";
import { Cache, Query } from "~/Data/DataInterfaces";
import { Task } from "~/Util/fp/Instances/Task";
import { rolesToRoleGroups, byRoleGroupName } from "~/Data/Person/Role/jobRoleData";
import { getEntity } from "~/Util/apiUtils";
import { NudgeUris } from "~/Uris/NudgeUris";
import { relationshipRisks } from "~/Data/Person/Relationship/relationshipData";
import { Compare } from "~/Util/fp/Instances/Compare";
import { propOr, pick, values, entries } from "~/Util/fp/object";
import { Pred } from "~/Util/fp/Instances/Pred";
import { isEmpty, groupBy, tail, optHead } from "~/Util/fp/array";
import { not } from "~/Util/fp/function";
import { List } from "~/Util/fp/Instances/List";


const hasIdentities = Pred.of<IPersonIdentity[]>(not(isEmpty))
    .contramap<IPersonIdentity[]>(is => is.filter(({ type = "" }) => type !== "facebook"))
    .contramap<Partial<Person>>(propOr("identities", [] as IPersonIdentity[]));
const hasTeamInteractions = Pred.of((dates: string[]) => dates.length > 0)
    .contramap<string[]>(vs => vs.filter(Boolean))
    .contramap<Record<string, string>>(values)
    .contramap<Interactions>(pick(["lastInbound", "lastOutbound", "lastMeeting"]))
    .contramap<Partial<Person>>(propOr("teamInteractions", {}));
export const hasStrengthTeamMember = Pred.of((uri: string) => !!uri)
    .contramap<Partial<Person>>(propOr("uri", ""))
    .contramap<Partial<Interactions>>(propOr("strengthTeamMember", {}))
    .contramap<Partial<Person>>(propOr("teamInteractions", {}));
const notUnknownLevel = Pred.of(({ level }: Partial<OrgChartPerson>) => level !== "unknown");
const duplicatesByLevelRoleName = (people: Partial<OrgChartPerson>[]) => List.of(
    groupBy<Partial<OrgChartPerson>>(({ name = "", displayLevel = "", displayRoles = [] }) =>
        `${displayLevel}_${optHead(displayRoles).getOrElse(() => "")}_${name}`)(people)
)
    .chain(dupObj => List.fromArray(entries(dupObj)))
    .chain(([_, dupArr]) => List.fromArray(tail(dupArr)))
    .map(({ uri = "" }) => uri)
    .filter(Boolean)
    .toArray();
const isDuplicate = (dupUris: string[]) => Pred.of(({ uri = "" }: Partial<OrgChartPerson>) => !dupUris.includes(uri));
const recommendedFilter = hasIdentities
    .concatOr(hasTeamInteractions)
    .concat(notUnknownLevel);
const byLevel = Compare.of(numCompareByDir(true))
    .contramap<JobLevel>((level) => option.of(jobLevelToOrdering(level)).getOrElse(() => Infinity))
    .contramap<Partial<OrgChartPerson>>(propOr("level", JobLevel.unknown));
const byFirstRole = (byRoleGroup: Compare<string>) => byRoleGroup
    .contramap<[string]>((roles) => optHead(roles).getOrElse(() => ""))
    .contramap<Partial<OrgChartPerson>>(propOr("displayRoles", []));
const byTeamInteractions: Compare<Partial<OrgChartPerson>> = Compare.of(truthyCompareByDir(false))
    .contramap<Partial<OrgChartPerson>>(hasTeamInteractions.run)
export const recommendedSort = (byRoleGroup: Compare<string>) =>
    byFirstRole(byRoleGroup).concat(byLevel).concat(byTeamInteractions);

const requiredCompanyFields = `uri,name,title,imageUrl,identities,level,roles,teamInteractions`;
const requiredListFields = `uri,name,title,imageUrl,identities,level,roles,teamInteractions,company(uri)`;
const levelAndRolesQuery = `NOT(level:"" OR level:"unknown" OR level:"individual" OR level:"manager" OR level:"senior_manager") AND NOT(teamInteractions.strength:[veryWeak TO veryStrong])`;

export enum RecommendationTypes {
    company = "company",
    list = "list",
}
export const getTeamRecommendedNewContacts = (
    type: RecommendationTypes,
    teamUri: string,
    findUri: string,    // either a company or list uri
    rolesQuery: Query,
    rolesOrdering: Ordering,
    cache?: Cache,
) => Task.of(teamUri === "collabs" ? undefined : teamUri)
    .map(team => ({
        limit: type === RecommendationTypes.company ? 50 : 999,
        fields: type === RecommendationTypes.company ? requiredCompanyFields : requiredListFields,
        team,
        q: (type === RecommendationTypes.company
            ? [`company.uri:"${findUri}"`, levelAndRolesQuery, rolesQuery].join(" AND ")
            : [`list.uri:"${findUri}"`, levelAndRolesQuery, rolesQuery].join(" AND ")),
    }))
    .chain(query => getEntity(NudgeUris.v2.people()._uri, query, { cache })
        .map((people: Partial<Person>[] = []) => ({ people, companyByRoleGroup: byRoleGroupName(rolesOrdering) })),
    )
    .map(({ people, companyByRoleGroup }) =>
        people
            .filter(recommendedFilter.run)
            .map(({ level = JobLevel.unknown, roles = [], ...restPerson }): Partial<OrgChartPerson> => ({
                ...restPerson,
                level,
                displayLevel: jobLevelTypeToDisplay(level),
                displayRoles: rolesToRoleGroups(roles).sort(companyByRoleGroup.run),
            }))
            .sort(recommendedSort(companyByRoleGroup).run),
    )
    // process duplicates
    .map(sortedPeople => sortedPeople.filter(isDuplicate(duplicatesByLevelRoleName(sortedPeople)).run))

const relationshipsQuery = `teamInteractions.strength:[veryWeak TO veryStrong]`;
export const getTeamRecommendedRelationshipsByRisks = (
    type: RecommendationTypes,
    teamUri: string,
    findUri: string,    // either a company or list uri
    rolesQuery: Query,
    rolesOrdering: Ordering,
    cache?: Cache,
) => Task.of(teamUri === "collabs" ? undefined : teamUri)
    .map(team => ({
        limit: type === RecommendationTypes.company ? 50 : 999,
        fields: type === RecommendationTypes.company ? requiredCompanyFields : requiredListFields,
        team,
        q: type === RecommendationTypes.company
            ? [`company.uri:"${findUri}"`, relationshipsQuery, rolesQuery].join(" AND ")
            : [`list.uri:"${findUri}"`, relationshipsQuery, rolesQuery].join(" AND "),
    }))
    .chain(query => getEntity(NudgeUris.v2.people()._uri, query, { cache })
        .map((people: Partial<Person>[] = []) => ({ people, compareByRoleGroup: byRoleGroupName(rolesOrdering) })),
    )
    .map(({ people, compareByRoleGroup }) =>
        option.of(people)
            .chain(people => option.of(new Date())
                .map(today => people
                    .filter(recommendedFilter.run)
                    .map(({ level = JobLevel.unknown, roles = [], ...restPerson }): Partial<OrgChartPerson> => ({
                        ...restPerson,
                        level,
                        displayLevel: jobLevelTypeToDisplay(level),
                        displayRoles: rolesToRoleGroups(roles).sort(compareByRoleGroup.run),
                    }))
                    .map(person => {
                        const { teamInteractions = {} } = person;
                        return {
                            ...person,
                            risks: relationshipRisks({ teamInteractions }, today),
                        } as unknown as OrgChartPerson;
                    })
                    .sort(recommendedSort(compareByRoleGroup).run)))
            .getOrElse(() => []));


const levelAndRolesQuery2 = `NOT(level:"" OR level:"unknown" OR level:"individual" OR level:"manager" OR level:"senior_manager")`;
export const getTeamRecommendedContacts = (
    teamUri: string,
    companyUri: string,
    rolesQuery: Query,
    rolesOrdering: Ordering,
    cache?: Cache,
) => Task.of(teamUri === "collabs" ? undefined : teamUri)
    .map(team => ({
        limit: 999,
        fields: requiredCompanyFields,
        team,
        q: `company.uri:"${companyUri}" AND ((${rolesQuery}) OR (${levelAndRolesQuery2}))`
    }))
    .chain(query => getEntity(NudgeUris.v2.people()._uri, query, { cache })
        .map((people: Partial<Person>[] = []) => ({ people, compareByRoleGroup: byRoleGroupName(rolesOrdering) })),
    );
