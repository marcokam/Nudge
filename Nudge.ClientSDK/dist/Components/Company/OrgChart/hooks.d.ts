/// <reference types="react" />
import { Person } from "../../../Data/NudgeInterfaces";
import { JobLevelDisplay } from "../../../Data/Person/Level/jobLevelData";
import { RelationshipStrength } from "../../../Data/Person/Relationship/relationshipData";
import { FlaggedDataReason } from "../../../Data/Person/Metadata/flagData";
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
export declare type OrgChartPerson = Person & ComputedRelationship;
export interface ByRole {
    [k: string]: OrgChartPerson[];
}
export declare type ByLevelByRole = [JobLevelDisplay, ByRole][];
export declare const orgChartFilters: {
    all: string;
    hasTeamStrength: string;
    hasStrongRelationship: string;
};
export declare const orgChartPrefix = "#OrgChart";
export declare const useCompanyOrgData: (companyUri?: string, teamUri?: string, initialFilter?: string, filterFn?: (_: Person) => boolean, cache?: any, topRoleToShow?: number, maxRecords?: number) => ({
    companyMembers: {
        apiState: string;
    };
    filters: {
        all: boolean;
        hasTeamStrength: boolean;
        hasStrongRelationship: boolean;
        hasWeakRelationship: boolean;
        weakened: boolean;
        newExecs: boolean;
        slipping: boolean;
        missingRoles: boolean;
    };
    flaggedUris: Record<string, FlaggedDataReason>;
    setCompanyMembers?: undefined;
    setFilterByType?: undefined;
    setFlaggedUris?: undefined;
} | {
    setCompanyMembers: import("react").Dispatch<import("react").SetStateAction<{
        apiState: string;
    }>>;
    setFilterByType: (filterType: string) => void;
    setFlaggedUris: import("react").Dispatch<import("react").SetStateAction<Record<string, FlaggedDataReason>>>;
    companyMembers?: undefined;
    filters?: undefined;
    flaggedUris?: undefined;
})[];
export {};
