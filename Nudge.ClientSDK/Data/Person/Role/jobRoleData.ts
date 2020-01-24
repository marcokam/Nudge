import { IJobRole } from "~/Data/NudgeInterfaces";
import { Task } from "~/Util/fp/Instances/Task";
import { option } from "~/Util/fp/Instances/Option";
import { getEntity } from "~/Util/apiUtils";
import { NudgeUris } from "~/Uris/NudgeUris";
import { compose } from "~/Util/fp/function";
import { mapEntries } from "~/Util/fp/object";
import { groupBy } from "~/Util/fp/array";
import { Ordering, numCompareByDir } from "~/Util/sortUtils";
import { GetEntityOptions } from "~/Data/DataInterfaces";
import { Compare } from "~/Util/fp/Instances/Compare";
import { tryCatch } from "~/Util/fp/Instances/Either";
import { Pair } from "~/Util/fp/Instances/Pair";

export interface Role {
    uri: string;
    name: string;
}
export interface RoleSummary {
    count: number;
    value: string;
}

export const roleToGroupName = ({ name = "Unknown" } = {}) => name.split(" - ").shift() || "";
export const roleToGroupSubgroup = ({ name = "Unknown" } = {}) => option.of(name.split(" - "))
    .map(parts => Pair.of(parts[0], tryCatch(() => parts[1]).getOrElse(() => "")))
    .getOrElse(() => Pair.of("Unknown", ""));
export const rolesToRoleGroups = (roles: IJobRole[]) => [...new Set(roles.filter(({ name }) => Boolean(name)).map(roleToGroupName))];

export const getRolesForTeam = (teamUri?: string, topRolesToShow = 10, defaultRoles = ["Leadership", "Sales", "Service", "Marketing", "Operations"], getEntityOptions?: GetEntityOptions) => Task.of(({
    q: teamUri ? `has:teamInteractions.strength` : `has:interactions.introStrength`,
    by: `roles`,
    team: teamUri,
    limit: 50,
}))
    .chain(rolesQuery => getEntity(NudgeUris.v2.people().count, rolesQuery, getEntityOptions))
    // get a count based on the role group (Eg. `Sales - General` and `Sales - Something else` are the same group)
    .map(
        compose(
            mapEntries((group, roles: RoleSummary[]): [string, number] => [group, roles.reduce((acc, r) => acc + r.count, 0)]),
            groupBy((role: RoleSummary) => roleToGroupName({ name: role.value || "Unknown" })),
        ),
    )
    // sort these roles by the highest count first, take the 1st 10
    .map((byCount) =>
        byCount
            .sort(Compare.of(numCompareByDir(false))
                .contramap(([_, count]: [unknown, number]) => count).run)
            .map(([roleGroup]) => roleGroup)
            .slice(0, topRolesToShow),
    )
    // if there are no roles, use the default roles
    .map(topRoles => (topRoles.length > 0 ? topRoles : defaultRoles))

export const byRoleGroupName = (ordering: Ordering = {}) => Compare.of(numCompareByDir(true))
    .contramap((role: string) => option.of(ordering[role])
        .getOrElse(() => Infinity));
