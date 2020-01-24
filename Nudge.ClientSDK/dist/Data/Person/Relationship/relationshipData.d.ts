import { Person, Interactions } from "../../NudgeInterfaces";
import { Task } from "../../../Util/fp/Instances/Task";
import { Pred } from "../../../Util/fp/Instances/Pred";
import { JobLevel } from "../Level/jobLevelData";
import { Role } from "../Role/jobRoleData";
import { Compare } from "../../../Util/fp/Instances/Compare";
export declare enum RelationshipStrength {
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
interface Link {
    source: string;
    target: string;
    value: number;
    strong?: number;
    active?: number;
}
interface PreformattedData {
    users: {
        [uri: string]: User;
    };
    people: {
        [uri: string]: UserConnectionPerson;
    };
    companies: {
        [uri: string]: Company;
    };
    links: Link[];
    levels: [JobLevel, Set<string>][];
    roles: [string, Set<string>][];
    userValues: User[];
    personValues: UserConnectionPerson[];
    companyValues: Company[];
}
export declare const toDiscreteRelStrength: (strengthAsFloat?: number) => number;
export declare const strengthToText: (strength: RelationshipStrength) => string;
export declare const strengthOrderingToText: (ordering?: number) => string;
export declare const strengthToOrdering: (strength: RelationshipStrength) => number;
export declare const strengthOrderingToStrength: (ordering?: number) => "none" | "medium" | "strong" | RelationshipStrength | "veryWeak" | "weak" | "veryStrong";
export declare const isStrongRelationship: (strength?: number) => boolean;
export declare const isActiveRelationship: (strength?: number) => boolean;
export declare const hasOwnStrength: Pred<Partial<Person>>;
export declare const hasTeamStrength: Pred<Partial<Person>>;
export declare const hasStrongTeamRelationship: Pred<Partial<Person>>;
export declare const hasWeakTeamRelationship: Pred<Partial<Person>>;
export declare const isWeakenedTeamRelationship: Pred<Partial<Person>>;
export declare const isSlippingTeamRelationship: (slippingDays?: number, today?: Date) => Pred<Partial<Person>>;
export declare const hasTeamContact: Pred<Partial<Person>>;
export declare const minLevel: (minLevel?: number) => (p: Partial<Person>) => boolean;
export declare const isExec: Pred<Partial<Person>>;
export declare const isExecRelationship: (p: Partial<Person>) => boolean;
export declare const newExec: (minimum?: number) => (p: Person) => boolean;
export declare const byTeamStrength: Compare<Partial<Person>>;
export declare const byTeamActiveRelationships: Compare<Partial<Person>>;
export declare const relationshipRisks: (entity: {
    teamInteractions: Interactions;
}, today?: Date) => {
    lastCommunication: string | Date;
    lastCommDisplay: string;
    slipping: boolean;
    weakened: boolean;
    singleThreaded: boolean;
    notStrong: boolean;
    riskCount: number;
    exec: boolean;
    strong: boolean;
    active: boolean;
};
export declare const summarizeData: (data: Partial<PreformattedData>) => {
    nodes: {
        type: string;
    }[];
    summaries: {};
    users?: {
        [uri: string]: User;
    } | undefined;
    people?: {
        [uri: string]: UserConnectionPerson;
    } | undefined;
    companies?: {
        [uri: string]: Company;
    } | undefined;
    links?: Link[] | undefined;
    levels?: [JobLevel, Set<string>][] | undefined;
    roles?: [string, Set<string>][] | undefined;
    userValues?: User[] | undefined;
    personValues?: UserConnectionPerson[] | undefined;
    companyValues?: Company[] | undefined;
};
export declare const formatRelationshipsData: (type: string | undefined, people: Person[]) => Task<unknown, {
    nodes: {
        type: string;
    }[];
    summaries: {};
    users?: {
        [uri: string]: User;
    } | undefined;
    people?: {
        [uri: string]: UserConnectionPerson;
    } | undefined;
    companies?: {
        [uri: string]: Company;
    } | undefined;
    links?: Link[] | undefined;
    levels?: [JobLevel, Set<string>][] | undefined;
    roles?: [string, Set<string>][] | undefined;
    userValues?: User[] | undefined;
    personValues?: UserConnectionPerson[] | undefined;
    companyValues?: Company[] | undefined;
}>;
export {};
