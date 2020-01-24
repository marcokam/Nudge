var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { Task } from "../../../Util/fp/Instances/Task";
import { option } from "../../../Util/fp/Instances/Option";
import { getEntity } from "../../../Util/apiUtils";
import { NudgeUris } from "../../../Uris/NudgeUris";
import { compose } from "../../../Util/fp/function";
import { mapEntries } from "../../../Util/fp/object";
import { groupBy } from "../../../Util/fp/array";
import { numCompareByDir } from "../../../Util/sortUtils";
import { Compare } from "../../../Util/fp/Instances/Compare";
import { tryCatch } from "../../../Util/fp/Instances/Either";
import { Pair } from "../../../Util/fp/Instances/Pair";
export var roleToGroupName = function (_a) {
    var _b = (_a === void 0 ? {} : _a).name, name = _b === void 0 ? "Unknown" : _b;
    return name.split(" - ").shift() || "";
};
export var roleToGroupSubgroup = function (_a) {
    var _b = (_a === void 0 ? {} : _a).name, name = _b === void 0 ? "Unknown" : _b;
    return option.of(name.split(" - "))
        .map(function (parts) { return Pair.of(parts[0], tryCatch(function () { return parts[1]; }).getOrElse(function () { return ""; })); })
        .getOrElse(function () { return Pair.of("Unknown", ""); });
};
export var rolesToRoleGroups = function (roles) { return __spread(new Set(roles.filter(function (_a) {
    var name = _a.name;
    return Boolean(name);
}).map(roleToGroupName))); };
export var getRolesForTeam = function (teamUri, topRolesToShow, defaultRoles, getEntityOptions) {
    if (topRolesToShow === void 0) { topRolesToShow = 10; }
    if (defaultRoles === void 0) { defaultRoles = ["Leadership", "Sales", "Service", "Marketing", "Operations"]; }
    return Task.of(({
        q: teamUri ? "has:teamInteractions.strength" : "has:interactions.introStrength",
        by: "roles",
        team: teamUri,
        limit: 50,
    }))
        .chain(function (rolesQuery) { return getEntity(NudgeUris.v2.people().count, rolesQuery, getEntityOptions); })
        // get a count based on the role group (Eg. `Sales - General` and `Sales - Something else` are the same group)
        .map(compose(mapEntries(function (group, roles) { return [group, roles.reduce(function (acc, r) { return acc + r.count; }, 0)]; }), groupBy(function (role) { return roleToGroupName({ name: role.value || "Unknown" }); })))
        // sort these roles by the highest count first, take the 1st 10
        .map(function (byCount) {
        return byCount
            .sort(Compare.of(numCompareByDir(false))
            .contramap(function (_a) {
            var _b = __read(_a, 2), _ = _b[0], count = _b[1];
            return count;
        }).run)
            .map(function (_a) {
            var _b = __read(_a, 1), roleGroup = _b[0];
            return roleGroup;
        })
            .slice(0, topRolesToShow);
    })
        // if there are no roles, use the default roles
        .map(function (topRoles) { return (topRoles.length > 0 ? topRoles : defaultRoles); });
};
export var byRoleGroupName = function (ordering) {
    if (ordering === void 0) { ordering = {}; }
    return Compare.of(numCompareByDir(true))
        .contramap(function (role) { return option.of(ordering[role])
        .getOrElse(function () { return Infinity; }); });
};
//# sourceMappingURL=jobRoleData.js.map