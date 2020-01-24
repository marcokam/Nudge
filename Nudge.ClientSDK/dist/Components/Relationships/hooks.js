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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { useState, useEffect } from "react";
import * as logger from "../../Logging/DefaultLogger";
import { apiStates, getAllEntities } from "../../Util/apiUtils";
import { tryCatch, option } from "../../Util/fp/Instances/Option";
import { values } from "../../Util/fp/object";
import { optHead, groupBy } from "../../Util/fp/array";
import { strengthOrderingToText, RelationshipStrength, strengthToOrdering } from "../../Data/Person/Relationship/relationshipData";
import { hasStrengthTeamMember } from "../../Data/Person/Recommender/personRecommenderData";
import { NudgeUris } from "../../Uris/NudgeUris";
;
;
var mergeType = function (type) { return function (o) { return (__assign(__assign({}, o), { type: type })); }; };
var incrementObjKeyProp = function (obj, key, prop, incrementValue) {
    var _a;
    if (incrementValue === void 0) { incrementValue = 1; }
    if (!obj[key]) {
        obj[key] = (_a = {}, _a[prop] = incrementValue, _a.total = incrementValue, _a);
    }
    else {
        obj[key].total += incrementValue;
        obj[key][prop] = (obj[key][prop] || 0) + incrementValue;
    }
};
export var summarizeData = function (data) {
    var _a = data.userValues, userValues = _a === void 0 ? [] : _a, _b = data.personValues, personValues = _b === void 0 ? [] : _b, _c = data.companyValues, companyValues = _c === void 0 ? [] : _c, _d = data.links, links = _d === void 0 ? [] : _d;
    return __assign(__assign({}, data), { nodes: __spread(userValues.map(mergeType("user")), personValues.map(mergeType("person")), companyValues.map(mergeType("company"))), summaries: links
            .map(function (link) { return (__assign(__assign({}, link), { strength: strengthOrderingToText(link.value), activeConnections: link.active || 0, strongConnections: link.strong || 0 })); })
            .reduce(function (summary, currentSummary) {
            var _a = currentSummary || {}, _b = _a.source, source = _b === void 0 ? "" : _b, _c = _a.target, target = _c === void 0 ? "" : _c, _d = _a.strength, strength = _d === void 0 ? "None" : _d, _e = _a.activeConnections, activeConnections = _e === void 0 ? 0 : _e, _f = _a.strongConnections, strongConnections = _f === void 0 ? 0 : _f;
            if (!activeConnections) {
                incrementObjKeyProp(summary, source, strength);
                incrementObjKeyProp(summary, target, strength);
                incrementObjKeyProp(summary, "allRelationships", strength);
            }
            else {
                incrementObjKeyProp(summary, source, "Active Connections", activeConnections);
                incrementObjKeyProp(summary, source, "Strong Connections", strongConnections);
                incrementObjKeyProp(summary, target, "Active Connections", activeConnections);
                incrementObjKeyProp(summary, target, "Strong Connections", strongConnections);
                incrementObjKeyProp(summary, "allRelationships", "Active Connections", activeConnections);
                incrementObjKeyProp(summary, "allRelationships", "Strong Connections", strongConnections);
            }
            return summary;
        }, {}) });
};
export var useRelationshipsData = function (type, companyUri, listUri, teamUri, getEntityOptions) {
    var _a = __read(useState({ apiState: apiStates.fetching, relationships: {} }), 2), relationshipsData = _a[0], setRelationshipsData = _a[1];
    useEffect(function () {
        var cancelled = false;
        if (!(companyUri || listUri) || !teamUri)
            return;
        var initialData = {
            users: {},
            people: {},
            companies: {},
            links: [],
            levels: new Map(),
            roles: new Map(),
        };
        setRelationshipsData(function (prev) { return (__assign(__assign({}, prev), { apiState: apiStates.fetching })); });
        var companiesTask = getAllEntities(NudgeUris.v2.companies()._uri, {
            fields: "uri,name,imageUrl,teamInteractions(activeRelationships,strongRelationships,strengthTeamMember(uri,name,title,imageUrl))",
            q: (companyUri ? "company.uri:\"" + companyUri + "\"" : "list.uri:\"" + listUri + "\"") + " AND teamInteractions.strength:[veryWeak TO veryStrong]",
            team: teamUri,
            limit: 99,
            aggregation: "none",
            hint: "analytics",
        }, getEntityOptions);
        var peopleTask = getAllEntities(NudgeUris.v2.people()._uri, {
            fields: "uri,name,title,imageUrl,level,roles,teamInteractions(strength,maxStrength,strengthTeamMember)",
            q: (companyUri ? "company.uri:\"" + companyUri + "\"" : "list.uri:\"" + listUri + "\"") + " AND teamInteractions.strength:[veryWeak TO veryStrong]",
            team: teamUri,
            limit: 99,
            aggregation: "none",
            hint: "analytics",
        }, getEntityOptions);
        var isContacts = !!companyUri || type === "person";
        var dataTask = isContacts ? peopleTask : companiesTask;
        dataTask
            .map(function (entities) { return entities.filter(hasStrengthTeamMember.run); })
            .map(groupBy(function (e) { return option.of(e.teamInteractions || {})
            .map(function (interactions) { return interactions.strengthTeamMember || {}; })
            .map(function (teamMember) { return teamMember.uri || ""; })
            .getOrElse(function () { return ""; }); }))
            .map(function (groupedEntities) { return values(groupedEntities)
            .map(function (entities) { return entities
            .map(function (e) { return tryCatch(function () { return e.teamInteractions; })
            .map(function (_a) {
            var _b;
            var _c = _a.activeRelationships, activeRelationships = _c === void 0 ? 0 : _c, _d = _a.strongRelationships, strongRelationships = _d === void 0 ? 0 : _d, _e = _a.strength, strength = _e === void 0 ? RelationshipStrength.none : _e, _f = _a.maxStrength, maxStrength = _f === void 0 ? RelationshipStrength.none : _f, _g = _a.strengthTeamMember, strengthTeamMember = _g === void 0 ? {} : _g;
            return (e.uri === strengthTeamMember.uri || (!isContacts && !activeRelationships))
                ? undefined
                : (_b = {
                        uri: e.uri
                    },
                    _b[isContacts ? "person" : "company"] = e,
                    _b.networkHealthScore = {
                        active: activeRelationships,
                        strong: strongRelationships,
                    },
                    _b.strength = strengthToOrdering(strength),
                    _b.maxStrength = strengthToOrdering(maxStrength),
                    _b.users = [__assign(__assign({}, strengthTeamMember), { jobTitle: strengthTeamMember.title, uri: "/team" + strengthTeamMember.uri })],
                    _b);
        })
            .getOrElse(function () { return undefined; }); })
            .filter(Boolean)
            .filter(function (uc) { return uc && (isContacts ? uc.strength > 0 : uc.networkHealthScore.active > 0); }); })
            .filter(function (ucs) { return ucs && ucs.length > 0; }); })
            .map(function (userConnections) {
            if (userConnections === void 0) { userConnections = []; }
            return userConnections.reduce(function (result, ucs) {
                if (ucs === void 0) { ucs = []; }
                var firstUser = optHead(ucs)
                    .chain(function (firstUc) { return tryCatch(function () { return firstUc.users; }); })
                    .chain(optHead)
                    .getOrElse(function () { return undefined; });
                var users = result.users;
                if (firstUser && firstUser.uri) {
                    users[firstUser.uri] = firstUser;
                }
                // extract people and links
                var _a = ucs.reduce(function (formattedData, uc) {
                    var person = uc.person, company = uc.company, _a = uc.strength, strength = _a === void 0 ? 0 : _a, networkHealthScore = uc.networkHealthScore;
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
                            var set = formattedData.levels.get(person.level) || new Set();
                            formattedData.levels.set(person.level, set.add(person.uri));
                        }
                        if (person.roles.length > 0) {
                            person.roles.forEach(function (_a) {
                                var _b = _a.name, name = _b === void 0 ? "" : _b;
                                if (!name) {
                                    return;
                                }
                                var _c = __read(name.split("-"), 1), _d = _c[0], groupName = _d === void 0 ? "" : _d;
                                var identifier = groupName.trim();
                                var set = formattedData.roles.get(identifier) || new Set(); // eslint-disable-line no-unused-vars
                                formattedData.roles.set(identifier, set.add(person.uri));
                            });
                        }
                    }
                    if (company && company.uri && firstUser && firstUser.uri) {
                        var _b = networkHealthScore || {}, _c = _b.active, active = _c === void 0 ? 0 : _c, _d = _b.strong, strong = _d === void 0 ? 0 : _d;
                        formattedData.companies[company.uri] = company;
                        formattedData.links.push({
                            source: firstUser.uri,
                            target: company.uri,
                            value: active,
                            strong: strong,
                            active: active,
                        });
                    }
                    return formattedData;
                }, {
                    links: result.links,
                    people: result.people,
                    companies: result.companies,
                    levels: result.levels,
                    roles: result.roles,
                }), people = _a.people, companies = _a.companies, links = _a.links, _b = _a.levels, levels = _b === void 0 ? new Map() : _b, _c = _a.roles, roles = _c === void 0 ? new Map() : _c;
                var formattedLinks;
                if (type === "company") {
                    var maxConnections_1 = links.reduce(function (currentMax, _a) {
                        var _b = _a.active, active = _b === void 0 ? 0 : _b;
                        return Math.max(currentMax, active);
                    }, 0);
                    formattedLinks = links.map(function (_a) {
                        var _b = _a.active, active = _b === void 0 ? 0 : _b, restLink = __rest(_a, ["active"]);
                        return (__assign(__assign({}, restLink), { active: active, value: ((active || 0) / maxConnections_1) * 10 }));
                    });
                }
                return {
                    users: users,
                    people: people,
                    companies: companies,
                    links: formattedLinks || links,
                    levels: levels,
                    roles: roles,
                };
            }, initialData);
        })
            .map(function (data) {
            if (data === void 0) { data = {}; }
            var _a = data.users, users = _a === void 0 ? {} : _a, _b = data.people, people = _b === void 0 ? {} : _b, _c = data.companies, companies = _c === void 0 ? {} : _c, _d = data.levels, levels = _d === void 0 ? new Map() : _d, _e = data.roles, roles = _e === void 0 ? new Map() : _e;
            var preFormattedData = __assign(__assign({}, data), { roles: Array.from(roles).sort(function (a, b) { return b[1].size - a[1].size; }), levels: Array.from(levels), userValues: Object.values(users), personValues: Object.values(people), companyValues: Object.values(companies) });
            var summarizedData = summarizeData(preFormattedData);
            return summarizedData;
        })
            .fork(function (err) {
            if (cancelled)
                return;
            logger.error("Error getting relationships", err);
            setRelationshipsData({ apiState: apiStates.error, relationships: {} });
        }, function (relationships) {
            if (cancelled)
                return;
            setRelationshipsData({ apiState: apiStates.fetched, relationships: relationships });
        });
        return function () {
            cancelled = true;
        };
    }, [type, companyUri, listUri, teamUri, getEntityOptions]);
    return [relationshipsData, setRelationshipsData];
};
//# sourceMappingURL=hooks.js.map