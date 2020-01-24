import { max, differenceInCalendarDays, isToday, distanceInWordsStrict, startOfDay} from "date-fns";

import { Person, Interactions } from "~/Data/NudgeInterfaces";

import { tryCatch, option } from "~/Util/fp/Instances/Option";
import { Task } from "~/Util/fp/Instances/Task";
import { Pred } from "~/Util/fp/Instances/Pred";
import { toUTCDate } from "~/Util/dateUtils";
import { groupBy, optHead } from "~/Util/fp/array";
import { values } from "~/Util/fp/object";
import { JobLevel, jobLevelToOrdering } from "~/Data/Person/Level/jobLevelData";
import { Role } from "~/Data/Person/Role/jobRoleData";
import { hasStrengthTeamMember } from "~/Data/Person/Recommender/personRecommenderData";
import { Compare } from "~/Util/fp/Instances/Compare";
import { numCompareByDir, generateOrdering } from "~/Util/sortUtils";
import { Pair } from "~/Util/fp/Instances/Pair";

export enum RelationshipStrength {
    none = "none",
    veryWeak = "veryWeak",
    weak = "weak",
    medium = "medium",
    strong = "strong",
    veryStrong = "veryStrong"
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

export const toDiscreteRelStrength = (strengthAsFloat = 0) => strengthAsFloat < 0.0001
    ? 0
    : strengthAsFloat >= 1
        ? 5
        : Math.floor(strengthAsFloat * 5) + 1;
const { typeToOrdering, orderingToType } = generateOrdering(RelationshipStrength);
const strengthDisplay: Record<RelationshipStrength, string> = Object.freeze({
    [RelationshipStrength.none]: "None",
    [RelationshipStrength.veryWeak]: "Very Weak",
    [RelationshipStrength.weak]: "Weak",
    [RelationshipStrength.medium]: "Medium",
    [RelationshipStrength.strong]: "Strong",
    [RelationshipStrength.veryStrong]: "Very Strong",
});
export const strengthToText = (strength: RelationshipStrength) => option.of(strengthDisplay[strength]).getOrElse(() => strengthDisplay.none);
export const strengthOrderingToText = (ordering = 0) => orderingToType(ordering).chain(strength => option.of(strengthDisplay[strength])).getOrElse(() => strengthDisplay.none);
export const strengthToOrdering = (strength: RelationshipStrength) => typeToOrdering(strength).getOrElse(() => 0);
export const strengthOrderingToStrength = (ordering = 0) => orderingToType(ordering).getOrElse(() => RelationshipStrength.none);


/* extract functions, maybe use lenses later? */
const interactionsStrength = (is: Interactions) => option.of(is.strength).getOrElse(() => RelationshipStrength.none);
const interactionsStrengthMaxStrength = (is: Interactions) => Pair.of(
    option.of(is.strength).getOrElse(() => RelationshipStrength.none),
    option.of(is.maxStrength).getOrElse(() => RelationshipStrength.none)
);
const interactionsActiveRelationships = (is: Interactions) => option.of(is.activeRelationships).getOrElse(() => 0);
const allInteractionsDates = (is: Interactions) => [
    option.of(is.lastInbound).getOrElse(() => ""),
    option.of(is.lastOutbound).getOrElse(() => ""),
    option.of(is.lastMeeting).getOrElse(() => ""),
].filter(Boolean);
const latestDate = (dates: string[]) => max(...dates);
const ownInteractions = (p: Partial<Person>) => option.of(p.interactions).getOrElse(() => ({}));
const teamInteractions = (p: Partial<Person>) => option.of(p.teamInteractions).getOrElse(() => ({}));

/* relationship filters */
export const isStrongRelationship = (strength = 0) => strength >= 4;
export const isActiveRelationship = (strength = 0) => strength < 4 && strength > 0;
const hasStrength = Pred.of((s: RelationshipStrength) => s !== RelationshipStrength.none)
const hasInteractionsStrength = hasStrength.contramap(interactionsStrength);
export const hasOwnStrength = hasInteractionsStrength.contramap(ownInteractions);
export const hasTeamStrength = hasInteractionsStrength.contramap(teamInteractions);
export const hasStrongTeamRelationship = Pred.of(isStrongRelationship)
    .contramap(strengthToOrdering)
    .contramap(interactionsStrength)
    .contramap(teamInteractions);
export const hasWeakTeamRelationship = Pred.not(hasStrongTeamRelationship);
export const isWeakenedTeamRelationship = Pred.of((strengthAndMaxStrength: Pair<RelationshipStrength, RelationshipStrength>) => strengthAndMaxStrength.merge((strength, maxStrength) => strength !== maxStrength))
    .contramap(interactionsStrengthMaxStrength)
    .contramap(teamInteractions);
export const isSlippingTeamRelationship = (slippingDays = 14, today = new Date()) => Pred.of((latestDate: Date) => differenceInCalendarDays(today, latestDate) > slippingDays)
    .contramap(latestDate)
    .contramap(allInteractionsDates)
    .contramap(teamInteractions);
export const hasTeamContact = Pred.of((contactDates: string[]) => contactDates.length > 0)
    .contramap(allInteractionsDates)
    .contramap(teamInteractions);
export const minLevel = (minLevel = jobLevelToOrdering(JobLevel.unknown)) => (p: Partial<Person>) =>
    tryCatch(() => p.level)
        .map(l => jobLevelToOrdering(l) <= minLevel)
        .getOrElse(() => false);
export const isExec = Pred.of(minLevel(jobLevelToOrdering(JobLevel.vicepresident)));
export const isExecRelationship = (p: Partial<Person>) =>
    hasTeamStrength.concat(isExec).run(p);
export const newExec = (minimum = jobLevelToOrdering(JobLevel.vicepresident)) => (p: Person) =>
    Pred.not(hasTeamStrength).concat(Pred.of(minLevel(minimum))).run(p);

/* relationship sorts */
const byStrength = Compare.of(numCompareByDir(false))
    .contramap(strengthToOrdering)
    .contramap(interactionsStrength);
export const byTeamStrength = byStrength
    .contramap(teamInteractions);
const byActiveRelationships = Compare.of(numCompareByDir(false))
    .contramap(interactionsActiveRelationships);
export const byTeamActiveRelationships = byActiveRelationships
    .contramap(teamInteractions);

const slippingDays = { start: 14, end: 210 };
export const relationshipRisks = (entity: { teamInteractions: Interactions }, today = new Date()) => {
    const { teamInteractions = {} } = entity;
    const {
        lastInbound = "",
        lastOutbound = "",
        lastMeeting = "",
        maxStrength = RelationshipStrength.none,
        strength = RelationshipStrength.none,
        strongRelationships = 0,
        activeRelationships = 0,
    } = teamInteractions;
    const communicationDates = [lastInbound, lastOutbound, lastMeeting].filter(Boolean).map(toUTCDate);
    const lastCommunication = communicationDates.length ? max(...communicationDates) : "";
    const lastCommDisplay = lastCommunication
        ? isToday(lastCommunication)
            ? "today"
            : distanceInWordsStrict(today, startOfDay(lastCommunication), {
                addSuffix: true,
                partialMethod: "floor",
            })
        : "no communication";
    const lastCommunicationDays = differenceInCalendarDays(today, lastCommunication);
    const slipping =
        !lastCommunication ||
        (lastCommunicationDays >= slippingDays.start && lastCommunicationDays <= slippingDays.end);
    const weakened = maxStrength !== strength;
    const singleThreaded = strongRelationships === 1;
    const notStrong = strongRelationships === 0;
    const riskCount =
        activeRelationships > 0 ? [singleThreaded || notStrong, slipping].filter(Boolean).length : 0;
    const exec = minLevel(jobLevelToOrdering(JobLevel.vicepresident))(entity as Person);
    const strong = strongRelationships > 1;
    const active = activeRelationships > 0;

    return {
        lastCommunication,
        lastCommDisplay,
        slipping,
        weakened,
        singleThreaded,
        notStrong,
        riskCount,
        exec,
        strong,
        active,
    };
}


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

export const formatRelationshipsData = (type = "person", people: Person[]) => Task.of(people)
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
                    (e.uri === strengthTeamMember.uri || (!(type === "person") && !activeRelationships))
                        ? undefined
                        : ({
                            uri: e.uri,
                            [type]: e,
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
            .filter(uc => uc && ((type === "person") ? uc.strength > 0 : uc.networkHealthScore.active > 0)))
        .filter(ucs => ucs && ucs.length > 0) as unknown as UserConnection[][])
    .map((userConnections: UserConnection[][] = []) => {
        const initialData: Data = {
            users: {},
            people: {},
            companies: {},
            links: [],
            levels: new Map(),
            roles: new Map(),
        };
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
    });
