import { Person } from "../../NudgeInterfaces";
import { OrgChartPerson } from "../../../Components/Company/OrgChart/hooks";
import { Ordering } from "../../../Util/sortUtils";
import { Cache, Query } from "../../DataInterfaces";
import { Task } from "../../../Util/fp/Instances/Task";
import { Compare } from "../../../Util/fp/Instances/Compare";
import { Pred } from "../../../Util/fp/Instances/Pred";
export declare const hasStrengthTeamMember: Pred<Partial<Person>>;
export declare const recommendedSort: (byRoleGroup: Compare<string>) => Compare<Partial<OrgChartPerson>>;
export declare enum RecommendationTypes {
    company = "company",
    list = "list"
}
export declare const getTeamRecommendedNewContacts: (type: RecommendationTypes, teamUri: string, findUri: string, rolesQuery: Query, rolesOrdering: Ordering, cache?: Cache | undefined) => Task<unknown, Partial<OrgChartPerson>[]>;
export declare const getTeamRecommendedRelationshipsByRisks: (type: RecommendationTypes, teamUri: string, findUri: string, rolesQuery: Query, rolesOrdering: Ordering, cache?: Cache | undefined) => Task<unknown, never[] | OrgChartPerson[]>;
export declare const getTeamRecommendedContacts: (teamUri: string, companyUri: string, rolesQuery: Query, rolesOrdering: Ordering, cache?: Cache | undefined) => Task<unknown, {
    people: Partial<Person>[];
    compareByRoleGroup: Compare<string>;
}>;
