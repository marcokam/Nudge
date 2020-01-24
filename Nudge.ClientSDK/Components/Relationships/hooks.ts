import { useState, useEffect } from "react";

import * as logger from "~/Logging/DefaultLogger";
import { GetEntityOptions } from "~/Data/DataInterfaces";
import { Person, Interactions } from "~/Data/NudgeInterfaces";
import { apiStates, getAllEntities } from "~/Util/apiUtils";
import { tryCatch, option } from "~/Util/fp/Instances/Option";
import { values } from "~/Util/fp/object";
import { optHead, groupBy } from "~/Util/fp/array";
import { JobLevel } from "~/Data/Person/Level/jobLevelData";
import { Role } from "~/Data/Person/Role/jobRoleData";
import { strengthOrderingToText, RelationshipStrength, strengthToOrdering } from "~/Data/Person/Relationship/relationshipData";
import { hasStrengthTeamMember } from "~/Data/Person/Recommender/personRecommenderData";
import { NudgeUris } from "~/Uris/NudgeUris";


interface Collaborator {
    uri: string;
    user?: { uri: string };
}
interface UserConnectionPerson {
    uri: string;
    name: string;
    title: string;
    imageUrl: string;
    level: JobLevel;
    roles: Role[];
    company?: Company;
    teamInteractions?: Interactions;
}
interface Company {
    uri: string;
    name: string;
    imageUrl: string;
}
interface User {
    uri: string;
    name: string;
    imageUrl: string;
}
interface NetworkHealthScore {
    active: number;
    strong: number;
    date: string;
    status: string;
}
interface UserConnection {
    uri?: string;
    person?: UserConnectionPerson;
    company?: Company;
    networkHealthScore?: NetworkHealthScore;
    users: User[];
    strength: number;
    maxStrength: number;
}
interface Link {
    source: string;
    target: string;
    value: number;
    strong?: number;
    active?: number;
}
interface Data {
    users: { [uri: string]: User };
    people: { [uri: string]: UserConnectionPerson };
    companies: { [uri: string]: Company };
    links: Link[];
    levels: Map<JobLevel, Set<string>>;
    roles: Map<string, Set<string>>;
};
interface PreformattedData {
    users: { [uri: string]: User };
    people: { [uri: string]: UserConnectionPerson };
    companies: { [uri: string]: Company };
    links: Link[];
    levels: [JobLevel, Set<string>][];
    roles: [string, Set<string>][];
    userValues: User[];
    personValues: UserConnectionPerson[];
    companyValues: Company[];
};

const mergeType = (type: string) => (o: {}) => ({ ...o, type });
const incrementObjKeyProp = (obj: { [key: string]: any }, key: string, prop: string, incrementValue = 1) => {
    if (!obj[key]) {
        obj[key] = { [prop]: incrementValue, total: incrementValue };
    } else {
        obj[key].total += incrementValue;
        obj[key][prop] = (obj[key][prop] || 0) + incrementValue;
    }
};
export const summarizeData = (data: Partial<PreformattedData>) => {
    const { userValues = [], personValues = [], companyValues = [], links = [] } = data;
    return {
        ...data,
        nodes: [
            ...userValues.map(mergeType("user")),
            ...personValues.map(mergeType("person")),
            ...companyValues.map(mergeType("company")),
        ],
        summaries: links
            .map(link => ({
                ...link,
                strength: strengthOrderingToText(link.value),
                activeConnections: link.active || 0,
                strongConnections: link.strong || 0,
            }))
            .reduce((summary, currentSummary) => {
                const { source = "", target = "", strength = "None", activeConnections = 0, strongConnections = 0 } = currentSummary || {};
                if (!activeConnections) {
                    incrementObjKeyProp(summary, source, strength);
                    incrementObjKeyProp(summary, target, strength);
                    incrementObjKeyProp(summary, "allRelationships", strength);
                } else {
                    incrementObjKeyProp(summary, source, "Active Connections", activeConnections);
                    incrementObjKeyProp(summary, source, "Strong Connections", strongConnections);
                    incrementObjKeyProp(summary, target, "Active Connections", activeConnections);
                    incrementObjKeyProp(summary, target, "Strong Connections", strongConnections);
                    incrementObjKeyProp(summary, "allRelationships", "Active Connections", activeConnections);
                    incrementObjKeyProp(summary, "allRelationships", "Strong Connections", strongConnections);
                }
                return summary;
            }, {}),
    };
};

export const useRelationshipsData = (
    type: string,
    companyUri?: string,
    listUri?: string,
    teamUri?: string,
    getEntityOptions?: GetEntityOptions
) => {
    const [relationshipsData, setRelationshipsData] = useState({ apiState: apiStates.fetching, relationships: {} });

    useEffect(() => {
        let cancelled = false;

        if (!(companyUri || listUri) || !teamUri) return;

        const initialData: Data = {
            users: {},
            people: {},
            companies: {},
            links: [],
            levels: new Map(),
            roles: new Map(),
        };

        setRelationshipsData(prev => ({ ...prev, apiState: apiStates.fetching }));

        const companiesTask = getAllEntities(NudgeUris.v2.companies()._uri, {
            fields: `uri,name,imageUrl,teamInteractions(activeRelationships,strongRelationships,strengthTeamMember(uri,name,title,imageUrl))`,
            q: `${companyUri ? `company.uri:"${companyUri}"` : `list.uri:"${listUri}"`} AND teamInteractions.strength:[veryWeak TO veryStrong]`,
            team: teamUri,
            limit: 99,
            aggregation: "none",
            hint: "analytics",
        }, getEntityOptions);
        const peopleTask = getAllEntities(NudgeUris.v2.people()._uri, {
            fields: `uri,name,title,imageUrl,level,roles,teamInteractions(strength,maxStrength,strengthTeamMember)`,
            q: `${companyUri ? `company.uri:"${companyUri}"` : `list.uri:"${listUri}"`} AND teamInteractions.strength:[veryWeak TO veryStrong]`,
            team: teamUri,
            limit: 99,
            aggregation: "none",
            hint: "analytics",
        }, getEntityOptions);
        const isContacts = !!companyUri || type === "person"
        const dataTask = isContacts ? peopleTask : companiesTask;

        dataTask
            .map((entities: (Person & Company)[]) => entities.filter(hasStrengthTeamMember.run))
            .map(groupBy(
                (e: (Person & Company)) => option.of(e.teamInteractions || {})
                    .map(interactions => interactions.strengthTeamMember || {})
                    .map(teamMember => teamMember.uri || "")
                    .getOrElse(() => "")
            ))
            .map(groupedEntities => values(groupedEntities)
                .map(entities => entities
                    .map(e => tryCatch(() => e.teamInteractions)
                        .map(({ activeRelationships = 0, strongRelationships = 0, strength = RelationshipStrength.none, maxStrength = RelationshipStrength.none, strengthTeamMember = {} }) =>
                            (e.uri === strengthTeamMember.uri || (!isContacts && !activeRelationships))
                                ? undefined
                                : ({
                                    uri: e.uri,
                                    [isContacts ? "person" : "company"]: e,
                                    networkHealthScore: {
                                        active: activeRelationships,
                                        strong: strongRelationships,
                                    },
                                    strength: strengthToOrdering(strength),
                                    maxStrength: strengthToOrdering(maxStrength),
                                    users: [{...strengthTeamMember, jobTitle: strengthTeamMember.title, uri: `/team${strengthTeamMember.uri}` }],
                                }))
                        .getOrElse(() => undefined))
                    .filter(Boolean)
                    .filter(uc => uc && (isContacts ? uc.strength > 0 : uc.networkHealthScore.active > 0)))
                .filter(ucs => ucs && ucs.length > 0) as unknown as UserConnection[][])
            .map((userConnections: UserConnection[][] = []) => {
                return userConnections.reduce((result, ucs = []) => {
                    const firstUser = optHead(ucs)
                        .chain(firstUc => tryCatch(() => firstUc.users))
                        .chain(optHead)
                        .getOrElse(() => undefined);
                    const users = result.users;
                    if (firstUser && firstUser.uri) {
                        users[firstUser.uri] = firstUser;
                    }

                    // extract people and links
                    const {
                        people,
                        companies,
                        links,
                        levels = new Map(),
                        roles = new Map(),
                    } = ucs.reduce(
                        (formattedData, uc) => {
                            const { person, company, strength = 0, networkHealthScore } = uc;
                            if (person && person.uri) {
                                if (firstUser && firstUser.uri) {
                                    formattedData.people[person.uri] = person;
                                    formattedData.links.push({
                                        source: firstUser.uri,
                                        target: person.uri,
                                        value: strength,
                                    });
                                }
                                if (person.level) {
                                    const set = formattedData.levels.get(person.level) || new Set();
                                    formattedData.levels.set(person.level, set.add(person.uri));
                                }
                                if (person.roles.length > 0) {
                                    person.roles.forEach(({ name = "" }) => {
                                        if (!name) {
                                            return;
                                        }
                                        const [groupName = ""] = name.split("-");
                                        const identifier = groupName.trim();
                                        const set = formattedData.roles.get(identifier) || new Set(); // eslint-disable-line no-unused-vars
                                        formattedData.roles.set(identifier, set.add(person.uri));
                                    });
                                }
                            }
                            if (company && company.uri && firstUser && firstUser.uri) {
                                const { active = 0, strong = 0 } = networkHealthScore || {};
                                formattedData.companies[company.uri] = company;
                                formattedData.links.push({
                                    source: firstUser.uri,
                                    target: company.uri,
                                    value: active,
                                    strong,
                                    active,
                                });
                            }
                            return formattedData;
                        },
                        {
                            links: result.links,
                            people: result.people,
                            companies: result.companies,
                            levels: result.levels,
                            roles: result.roles,
                        },
                    );

                    let formattedLinks;
                    if (type === "company") {
                        const maxConnections = links.reduce(
                            (currentMax, { active = 0 }) => Math.max(currentMax, active),
                            0,
                        );
                        formattedLinks = links.map(({ active = 0, ...restLink }) => ({ ...restLink, active, value: ((active || 0) / maxConnections) * 10 }));
                    }

                    return {
                        users,
                        people,
                        companies,
                        links: formattedLinks || links,
                        levels,
                        roles,
                    };
                }, initialData);
            })
            .map((data: Partial<Data> = {}) => {
                const { users = {}, people = {}, companies = {}, levels = new Map<JobLevel, Set<string>>(), roles = new Map<string, Set<string>>() } = data;
                const preFormattedData = {
                    ...data,
                    roles: Array.from(roles).sort((a, b) => b[1].size - a[1].size),
                    levels: Array.from(levels),
                    userValues: Object.values(users),
                    personValues: Object.values(people),
                    companyValues: Object.values(companies),
                };
                const summarizedData = summarizeData(preFormattedData);
                return summarizedData;
            })
            .fork(
                err => {
                    if (cancelled) return;
                    logger.error("Error getting relationships", err);
                    setRelationshipsData({ apiState: apiStates.error, relationships: {} });
                },
                (relationships) => {
                    if (cancelled) return;
                    setRelationshipsData({ apiState: apiStates.fetched, relationships });
                },
            );


        return () => {
            cancelled = true;
        };
    }, [type, companyUri, listUri, teamUri, getEntityOptions]);

    return [relationshipsData, setRelationshipsData];
}
