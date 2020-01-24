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
import { useState, useEffect, useCallback, useMemo } from "react";
import { Task } from "../../../Util/fp/Instances/Task";
import NudgeIterable from "../../../Util/NudgeIterable";
import { Compare } from "../../../Util/fp/Instances/Compare";
import { NudgeUris } from "../../../Uris/NudgeUris";
import { allPass, compose } from "../../../Util/fp/function";
import { optHead, groupBy, uniq } from "../../../Util/fp/array";
import { optProp, mapEntries, entries, propOr } from "../../../Util/fp/object";
import { tryCatch, option } from "../../../Util/fp/Instances/Option";
import { getEntity, apiStates } from "../../../Util/apiUtils";
import { numCompareByDir, truthyCompareByDir, valuesToOrdering, sortValueLast, } from "../../../Util/sortUtils";
import * as logger from "../../../Logging/DefaultLogger";
import { roleToGroupName, getRolesForTeam, byRoleGroupName, rolesToRoleGroups } from "../../../Data/Person/Role/jobRoleData";
import { jobLevelTypeToDisplay, byLevelDisplay } from "../../../Data/Person/Level/jobLevelData";
import { RelationshipStrength, strengthToOrdering, hasTeamStrength, hasStrongTeamRelationship, hasWeakTeamRelationship, isWeakenedTeamRelationship, isSlippingTeamRelationship, newExec, relationshipRisks, } from "../../../Data/Person/Relationship/relationshipData";
import { getCurrentFlaggedData, getPrefixAndReason, flaggedDataReason } from "../../../Data/Person/Metadata/flagData";
;
var anyPerson = function (_) { return true; };
var initialFilters = {
    all: false,
    hasTeamStrength: false,
    hasStrongRelationship: false,
    hasWeakRelationship: false,
    weakened: false,
    newExecs: false,
    slipping: false,
    missingRoles: false,
};
export var orgChartFilters = {
    all: "all",
    hasTeamStrength: "hasTeamStrength",
    hasStrongRelationship: "hasStrongRelationship",
};
export var orgChartPrefix = "#OrgChart";
export var useCompanyOrgData = function (companyUri, teamUri, initialFilter, filterFn, cache, topRoleToShow, maxRecords) {
    var _a;
    if (companyUri === void 0) { companyUri = ""; }
    if (teamUri === void 0) { teamUri = ""; }
    if (initialFilter === void 0) { initialFilter = orgChartFilters.hasTeamStrength; }
    if (filterFn === void 0) { filterFn = anyPerson; }
    if (topRoleToShow === void 0) { topRoleToShow = 10; }
    if (maxRecords === void 0) { maxRecords = 999; }
    var _b = __read(useState({ apiState: apiStates.fetching }), 2), companyMembers = _b[0], setCompanyMembers = _b[1];
    var _c = __read(useState({}), 2), flaggedUris = _c[0], setFlaggedUris = _c[1];
    var _d = __read(useState(__assign(__assign({}, initialFilters), (_a = {}, _a[initialFilter] = true, _a))), 2), filters = _d[0], setFilters = _d[1];
    var setFilterByType = useCallback(function (filterType) {
        var _a;
        setFilters(__assign(__assign({}, initialFilters), (_a = {}, _a[filterType] = true, _a)));
    }, [setFilters]);
    var interactionsToUse = useMemo(function () { return teamUri ? "teamInteractions" : "interactions"; }, [teamUri]);
    useEffect(function () {
        var cancelled = false;
        getCurrentFlaggedData()
            .map(function (response) {
            if (response === void 0) { response = []; }
            return response
                .filter(function (d) { return !!(d.person1 && d.person1.uri) && getPrefixAndReason(d.note).prefix === orgChartPrefix; })
                .map(function (d) { return ({ uri: (d.person1 && d.person1.uri) || "", note: d.note }); })
                .reduce(function (acc, _a) {
                var uri = _a.uri, note = _a.note;
                acc[uri] = getPrefixAndReason(note).reason;
                return acc;
            }, {});
        })
            .fork(function (err) {
            if (cancelled)
                return;
            logger.error("Error getting flagged data", err);
        }, function (flaggedUris) {
            if (cancelled)
                return;
            setFlaggedUris(flaggedUris);
        });
        return function () {
            cancelled = true;
        };
    }, []);
    useEffect(function () {
        if (!companyUri || !teamUri)
            return;
        var cancelled = false;
        setCompanyMembers(function (prevCompanyMembers) { return (__assign(__assign({}, prevCompanyMembers), { apiState: apiStates.fetching })); });
        Task.of({
            q: "company.uri:\"" + companyUri + "\"",
            fields: "uri,name,title,imageUrl,level,roles," + interactionsToUse,
            team: teamUri,
        })
            .chain(function (queryOptions) {
            return getRolesForTeam(teamUri, topRoleToShow, undefined, { cache: cache })
                // generate the query that will be used to get people later based on the roles found
                .map(function (roles) {
                if (roles === void 0) { roles = []; }
                return ({
                    rolesOrdering: valuesToOrdering(roles),
                    query: __assign(__assign({}, queryOptions), { 
                        // people in the company, either in a role that the team sells to or someone they've previously communicated with
                        q: queryOptions.q + " AND ((has:level AND NOT(level:unknown) AND NOT(level:\"\") AND has:roles AND (" + roles
                            .map(function (r) { return "roles.name:\"" + r + "\""; })
                            .join(" OR ") + ")) OR has:" + interactionsToUse + ".lastInbound OR has:" + interactionsToUse + ".lastOutbound OR has:" + interactionsToUse + ".lastMeeting)" })
                });
            });
        })
            // get a count of the people that will be returned by the query
            .chain(function (_a) {
            var rolesOrdering = _a.rolesOrdering, query = _a.query;
            return getEntity(NudgeUris.v2.people().count, query, { cache: cache })
                .map(function (results) { return optHead(results)
                .chain(optProp("count"))
                .getOrElse(function () { return 0; }); })
                .map(function (count) { return ({
                compareByRoleGroup: byRoleGroupName(rolesOrdering),
                count: count,
                query: query,
            }); });
        })
            // use the count to limit the people query
            .chain(function (_a) {
            var compareByRoleGroup = _a.compareByRoleGroup, count = _a.count, query = _a.query;
            return getEntity(NudgeUris.v2.people()._uri, __assign(__assign({}, query), { limit: Math.min(count, maxRecords) }), { cache: cache })
                // filter any people that were flagged with incorrectCompany
                .map(function (people) {
                if (people === void 0) { people = []; }
                return people.filter(function (p) { return flaggedUris[p.uri] !== flaggedDataReason.incorrectCompany; });
            })
                // calculate some values that we will need for each person, and make sure they have defaults
                .map(function (people) {
                return people
                    // teamInteractions might be empty
                    .map(function (p) {
                    return (__assign(__assign(__assign(__assign({}, p), { teamInteractions: teamUri ? p.teamInteractions : p.interactions }), tryCatch(function () { return teamUri ? p.teamInteractions : p.interactions; })
                        .map(function (_a) {
                        var _b = _a.strength, strength = _b === void 0 ? RelationshipStrength.none : _b, _c = _a.maxStrength, maxStrength = _c === void 0 ? RelationshipStrength.none : _c, _d = _a.lastInbound, lastInbound = _d === void 0 ? "" : _d, _e = _a.lastOutbound, lastOutbound = _e === void 0 ? "" : _e, _f = _a.lastMeeting, lastMeeting = _f === void 0 ? "" : _f;
                        return ({
                            strength: strength,
                            maxStrength: maxStrength,
                            strengthValue: strengthToOrdering(strength),
                            hasTeamInteraction: !!lastInbound || !!lastOutbound || !!lastMeeting,
                        });
                    })
                        .getOrElse(function () { return ({
                        strength: RelationshipStrength.none,
                        maxStrength: RelationshipStrength.none,
                        strengthValue: 0,
                        hasTeamInteraction: false,
                    }); })), {
                        firstRole: tryCatch(function () { return p.roles; })
                            .map(function (roles) {
                            return roles.map(roleToGroupName).sort(compareByRoleGroup.run);
                        })
                            .chain(function (roles) { return optHead(roles); })
                            .getOrElse(function () { return "Unknown"; }),
                        displayLevel: jobLevelTypeToDisplay(p.level),
                        displayRoles: tryCatch(function () { return p.roles; })
                            .map(function (roles) { return rolesToRoleGroups(roles).sort(compareByRoleGroup.run); })
                            .getOrElse(function () { return []; }),
                        risks: relationshipRisks(p),
                    }));
                })
                    // for each level/role, we want to highlight people where the team has had some
                    //   previous relationship, and also show highest current strength first
                    .sort(byLevelDisplay
                    .contramap(function (p) { return p.displayLevel; })
                    .concat(Compare.of(numCompareByDir(false))
                    .contramap(function (p) { return p.strengthValue; })
                    .concat(Compare.of(truthyCompareByDir(false))
                    .contramap(function (p) { return p.hasTeamInteraction; })))
                    .run);
            })
                .map(function (people) { return ({
                people: people,
                duplicates: compose(function (entries) { return NudgeIterable.fromArray(entries)
                    .filter(function (_a) {
                    var _b = __read(_a, 2), _ = _b[0], dups = _b[1];
                    return dups.length > 1;
                })
                    .flatMap(function (_a) {
                    var _b = __read(_a, 2), _ = _b[0], dups = _b[1];
                    return NudgeIterable.fromArray(dups.slice(1));
                })
                    .toArray(); }, entries, groupBy(function (p) { return p.firstRole + "_" + p.level + "_" + p.name; }))(people),
            }); })
                .map(function (_a) {
                var _b = _a.people, people = _b === void 0 ? [] : _b, duplicates = _a.duplicates;
                return option.of(duplicates)
                    .map(function (duplicates) { return duplicates.map(propOr("uri", "")); })
                    .map(function (dupUris) { return people.filter(function (_a) {
                    var uri = _a.uri;
                    return !dupUris.includes(uri);
                }); })
                    .getOrElse(function () { return people; });
            })
                .map(function (people) { return ({
                filteredPeople: people.filter(allPass([
                    filterFn,
                    filters.hasTeamStrength ? hasTeamStrength.run : anyPerson,
                    filters.hasStrongRelationship ? hasStrongTeamRelationship.run : anyPerson,
                    filters.hasWeakRelationship ? hasWeakTeamRelationship.run : anyPerson,
                    filters.weakened ? isWeakenedTeamRelationship.run : anyPerson,
                    filters.slipping ? isSlippingTeamRelationship().run : anyPerson,
                    filters.newExecs ? newExec() : anyPerson,
                ])),
                filterCounts: people.reduce(function (filterCounts, p) {
                    if (hasTeamStrength.run(p))
                        filterCounts.hasTeamStrength++;
                    if (hasStrongTeamRelationship.run(p))
                        filterCounts.hasStrongRelationship++;
                    if (hasWeakTeamRelationship.run(p))
                        filterCounts.hasWeakRelationship++;
                    if (isWeakenedTeamRelationship.run(p))
                        filterCounts.weakened++;
                    if (isSlippingTeamRelationship().run(p))
                        filterCounts.slipping++;
                    if (newExec()(p))
                        filterCounts.newExecs++;
                    return filterCounts;
                }, {
                    all: people.length,
                    hasTeamStrength: 0,
                    hasStrongRelationship: 0,
                    hasWeakRelationship: 0,
                    weakened: 0,
                    slipping: 0,
                    newExecs: 0,
                }),
            }); })
                .map(function (_a) {
                var filteredPeople = _a.filteredPeople, filterCounts = _a.filterCounts;
                return ({
                    // group people by their display level
                    byLevel: groupBy(function (p) { return jobLevelTypeToDisplay(p.level); })(filteredPeople),
                    // also get all the unique first roles for this list of people, order it by most team relationships (previously fetched)
                    allRoles: uniq(filteredPeople.map(function (p) { return p.firstRole; })).sort(compareByRoleGroup.run),
                    filterCounts: filterCounts,
                    flaggedUris: flaggedUris,
                });
            });
        })
            // for each level, group people by their first role
            .map(function (_a) {
            var byLevel = _a.byLevel, allRoles = _a.allRoles, filterCounts = _a.filterCounts, flaggedUris = _a.flaggedUris;
            return ({
                people: mapEntries(function (level, people) { return [
                    level,
                    groupBy(function (p) { return p.firstRole; })(people),
                ]; })(byLevel),
                allRoles: allRoles.sort(sortValueLast("Unknown", true)),
                filterCounts: filterCounts,
                flaggedUris: flaggedUris,
            });
        })
            // assemble the final results
            .map(function (_a) {
            var people = _a.people, allRoles = _a.allRoles, filterCounts = _a.filterCounts, flaggedUris = _a.flaggedUris;
            return ({
                count: people.reduce(function (acc, _a) {
                    var _b = __read(_a, 2), _ = _b[0], rolesSummary = _b[1];
                    return acc + entries(rolesSummary)
                        .reduce(function (acc, _a) {
                        var _b = __read(_a, 2), _ = _b[0], people = _b[1];
                        return acc + people.length;
                    }, 0);
                }, 0),
                people: people,
                allRoles: allRoles,
                allRolesOrdering: valuesToOrdering(allRoles),
                filterCounts: filterCounts,
                flaggedUris: flaggedUris,
            });
        })
            .fork(function (err) {
            logger.error("Error getting company members for org chart", err);
            if (cancelled)
                return;
            setCompanyMembers({ apiState: apiStates.error });
        }, function (results) {
            if (cancelled)
                return;
            setCompanyMembers(__assign({ apiState: apiStates.fetched }, results));
        });
        return function () {
            cancelled = true;
        };
    }, [companyUri, teamUri, filterFn, filters, cache, topRoleToShow, maxRecords, interactionsToUse, flaggedUris]);
    return [{ companyMembers: companyMembers, filters: filters, flaggedUris: flaggedUris }, { setCompanyMembers: setCompanyMembers, setFilterByType: setFilterByType, setFlaggedUris: setFlaggedUris }];
};
//# sourceMappingURL=hooks.js.map