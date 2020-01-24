var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
import { numCompareByDir, truthyCompareByDir } from "../../../Util/sortUtils";
import { option } from "../../../Util/fp/Instances/Option";
import { jobLevelToOrdering, jobLevelTypeToDisplay, JobLevel } from "../Level/jobLevelData";
import { Task } from "../../../Util/fp/Instances/Task";
import { rolesToRoleGroups, byRoleGroupName } from "../Role/jobRoleData";
import { getEntity } from "../../../Util/apiUtils";
import { NudgeUris } from "../../../Uris/NudgeUris";
import { relationshipRisks } from "../Relationship/relationshipData";
import { Compare } from "../../../Util/fp/Instances/Compare";
import { propOr, pick, values, entries } from "../../../Util/fp/object";
import { Pred } from "../../../Util/fp/Instances/Pred";
import { isEmpty, groupBy, tail, optHead } from "../../../Util/fp/array";
import { not } from "../../../Util/fp/function";
import { List } from "../../../Util/fp/Instances/List";
var hasIdentities = Pred.of(not(isEmpty))
    .contramap(function (is) { return is.filter(function (_a) {
    var _b = _a.type, type = _b === void 0 ? "" : _b;
    return type !== "facebook";
}); })
    .contramap(propOr("identities", []));
var hasTeamInteractions = Pred.of(function (dates) { return dates.length > 0; })
    .contramap(function (vs) { return vs.filter(Boolean); })
    .contramap(values)
    .contramap(pick(["lastInbound", "lastOutbound", "lastMeeting"]))
    .contramap(propOr("teamInteractions", {}));
export var hasStrengthTeamMember = Pred.of(function (uri) { return !!uri; })
    .contramap(propOr("uri", ""))
    .contramap(propOr("strengthTeamMember", {}))
    .contramap(propOr("teamInteractions", {}));
var notUnknownLevel = Pred.of(function (_a) {
    var level = _a.level;
    return level !== "unknown";
});
var duplicatesByLevelRoleName = function (people) { return List.of(groupBy(function (_a) {
    var _b = _a.name, name = _b === void 0 ? "" : _b, _c = _a.displayLevel, displayLevel = _c === void 0 ? "" : _c, _d = _a.displayRoles, displayRoles = _d === void 0 ? [] : _d;
    return displayLevel + "_" + optHead(displayRoles).getOrElse(function () { return ""; }) + "_" + name;
})(people))
    .chain(function (dupObj) { return List.fromArray(entries(dupObj)); })
    .chain(function (_a) {
    var _b = __read(_a, 2), _ = _b[0], dupArr = _b[1];
    return List.fromArray(tail(dupArr));
})
    .map(function (_a) {
    var _b = _a.uri, uri = _b === void 0 ? "" : _b;
    return uri;
})
    .filter(Boolean)
    .toArray(); };
var isDuplicate = function (dupUris) { return Pred.of(function (_a) {
    var _b = _a.uri, uri = _b === void 0 ? "" : _b;
    return !dupUris.includes(uri);
}); };
var recommendedFilter = hasIdentities
    .concatOr(hasTeamInteractions)
    .concat(notUnknownLevel);
var byLevel = Compare.of(numCompareByDir(true))
    .contramap(function (level) { return option.of(jobLevelToOrdering(level)).getOrElse(function () { return Infinity; }); })
    .contramap(propOr("level", JobLevel.unknown));
var byFirstRole = function (byRoleGroup) { return byRoleGroup
    .contramap(function (roles) { return optHead(roles).getOrElse(function () { return ""; }); })
    .contramap(propOr("displayRoles", [])); };
var byTeamInteractions = Compare.of(truthyCompareByDir(false))
    .contramap(hasTeamInteractions.run);
export var recommendedSort = function (byRoleGroup) {
    return byFirstRole(byRoleGroup).concat(byLevel).concat(byTeamInteractions);
};
var requiredCompanyFields = "uri,name,title,imageUrl,identities,level,roles,teamInteractions";
var requiredListFields = "uri,name,title,imageUrl,identities,level,roles,teamInteractions,company(uri)";
var levelAndRolesQuery = "NOT(level:\"\" OR level:\"unknown\" OR level:\"individual\" OR level:\"manager\" OR level:\"senior_manager\") AND NOT(teamInteractions.strength:[veryWeak TO veryStrong])";
export var RecommendationTypes;
(function (RecommendationTypes) {
    RecommendationTypes["company"] = "company";
    RecommendationTypes["list"] = "list";
})(RecommendationTypes || (RecommendationTypes = {}));
export var getTeamRecommendedNewContacts = function (type, teamUri, findUri, // either a company or list uri
rolesQuery, rolesOrdering, cache) { return Task.of(teamUri === "collabs" ? undefined : teamUri)
    .map(function (team) { return ({
    limit: type === RecommendationTypes.company ? 50 : 999,
    fields: type === RecommendationTypes.company ? requiredCompanyFields : requiredListFields,
    team: team,
    q: (type === RecommendationTypes.company
        ? ["company.uri:\"" + findUri + "\"", levelAndRolesQuery, rolesQuery].join(" AND ")
        : ["list.uri:\"" + findUri + "\"", levelAndRolesQuery, rolesQuery].join(" AND ")),
}); })
    .chain(function (query) { return getEntity(NudgeUris.v2.people()._uri, query, { cache: cache })
    .map(function (people) {
    if (people === void 0) { people = []; }
    return ({ people: people, companyByRoleGroup: byRoleGroupName(rolesOrdering) });
}); })
    .map(function (_a) {
    var people = _a.people, companyByRoleGroup = _a.companyByRoleGroup;
    return people
        .filter(recommendedFilter.run)
        .map(function (_a) {
        var _b = _a.level, level = _b === void 0 ? JobLevel.unknown : _b, _c = _a.roles, roles = _c === void 0 ? [] : _c, restPerson = __rest(_a, ["level", "roles"]);
        return (__assign(__assign({}, restPerson), { level: level, displayLevel: jobLevelTypeToDisplay(level), displayRoles: rolesToRoleGroups(roles).sort(companyByRoleGroup.run) }));
    })
        .sort(recommendedSort(companyByRoleGroup).run);
})
    // process duplicates
    .map(function (sortedPeople) { return sortedPeople.filter(isDuplicate(duplicatesByLevelRoleName(sortedPeople)).run); }); };
var relationshipsQuery = "teamInteractions.strength:[veryWeak TO veryStrong]";
export var getTeamRecommendedRelationshipsByRisks = function (type, teamUri, findUri, // either a company or list uri
rolesQuery, rolesOrdering, cache) { return Task.of(teamUri === "collabs" ? undefined : teamUri)
    .map(function (team) { return ({
    limit: type === RecommendationTypes.company ? 50 : 999,
    fields: type === RecommendationTypes.company ? requiredCompanyFields : requiredListFields,
    team: team,
    q: type === RecommendationTypes.company
        ? ["company.uri:\"" + findUri + "\"", relationshipsQuery, rolesQuery].join(" AND ")
        : ["list.uri:\"" + findUri + "\"", relationshipsQuery, rolesQuery].join(" AND "),
}); })
    .chain(function (query) { return getEntity(NudgeUris.v2.people()._uri, query, { cache: cache })
    .map(function (people) {
    if (people === void 0) { people = []; }
    return ({ people: people, compareByRoleGroup: byRoleGroupName(rolesOrdering) });
}); })
    .map(function (_a) {
    var people = _a.people, compareByRoleGroup = _a.compareByRoleGroup;
    return option.of(people)
        .chain(function (people) { return option.of(new Date())
        .map(function (today) { return people
        .filter(recommendedFilter.run)
        .map(function (_a) {
        var _b = _a.level, level = _b === void 0 ? JobLevel.unknown : _b, _c = _a.roles, roles = _c === void 0 ? [] : _c, restPerson = __rest(_a, ["level", "roles"]);
        return (__assign(__assign({}, restPerson), { level: level, displayLevel: jobLevelTypeToDisplay(level), displayRoles: rolesToRoleGroups(roles).sort(compareByRoleGroup.run) }));
    })
        .map(function (person) {
        var _a = person.teamInteractions, teamInteractions = _a === void 0 ? {} : _a;
        return __assign(__assign({}, person), { risks: relationshipRisks({ teamInteractions: teamInteractions }, today) });
    })
        .sort(recommendedSort(compareByRoleGroup).run); }); })
        .getOrElse(function () { return []; });
}); };
var levelAndRolesQuery2 = "NOT(level:\"\" OR level:\"unknown\" OR level:\"individual\" OR level:\"manager\" OR level:\"senior_manager\")";
export var getTeamRecommendedContacts = function (teamUri, companyUri, rolesQuery, rolesOrdering, cache) { return Task.of(teamUri === "collabs" ? undefined : teamUri)
    .map(function (team) { return ({
    limit: 999,
    fields: requiredCompanyFields,
    team: team,
    q: "company.uri:\"" + companyUri + "\" AND ((" + rolesQuery + ") OR (" + levelAndRolesQuery2 + "))"
}); })
    .chain(function (query) { return getEntity(NudgeUris.v2.people()._uri, query, { cache: cache })
    .map(function (people) {
    if (people === void 0) { people = []; }
    return ({ people: people, compareByRoleGroup: byRoleGroupName(rolesOrdering) });
}); }); };
//# sourceMappingURL=personRecommenderData.js.map