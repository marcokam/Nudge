import { IJobRole } from "../../NudgeInterfaces";
import { Task } from "../../../Util/fp/Instances/Task";
import { Ordering } from "../../../Util/sortUtils";
import { GetEntityOptions } from "../../DataInterfaces";
import { Compare } from "../../../Util/fp/Instances/Compare";
import { Pair } from "../../../Util/fp/Instances/Pair";
export interface Role {
    uri: string;
    name: string;
}
export interface RoleSummary {
    count: number;
    value: string;
}
export declare const roleToGroupName: ({ name }?: {
    name?: string | undefined;
}) => string;
export declare const roleToGroupSubgroup: ({ name }?: {
    name?: string | undefined;
}) => Pair<string, unknown> | Pair<string, string>;
export declare const rolesToRoleGroups: (roles: IJobRole[]) => string[];
export declare const getRolesForTeam: (teamUri?: string | undefined, topRolesToShow?: number, defaultRoles?: string[], getEntityOptions?: GetEntityOptions | undefined) => Task<unknown, string[]>;
export declare const byRoleGroupName: (ordering?: Ordering) => Compare<string>;
