/// <reference types="react" />
import { GetEntityOptions } from "../../Data/DataInterfaces";
import { Interactions } from "../../Data/NudgeInterfaces";
import { JobLevel } from "../../Data/Person/Level/jobLevelData";
import { Role } from "../../Data/Person/Role/jobRoleData";
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
export declare const useRelationshipsData: (type: string, companyUri?: string | undefined, listUri?: string | undefined, teamUri?: string | undefined, getEntityOptions?: GetEntityOptions | undefined) => ({
    apiState: string;
    relationships: {};
} | import("react").Dispatch<import("react").SetStateAction<{
    apiState: string;
    relationships: {};
}>>)[];
export {};
