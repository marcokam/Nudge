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
var _a;
import { max, differenceInCalendarDays, isToday, distanceInWordsStrict, startOfDay } from "date-fns";
import { tryCatch, option } from "../../../Util/fp/Instances/Option";
import { Task } from "../../../Util/fp/Instances/Task";
import { Pred } from "../../../Util/fp/Instances/Pred";
import { toUTCDate } from "../../../Util/dateUtils";
import { groupBy, optHead } from "../../../Util/fp/array";
import { values } from "../../../Util/fp/object";
import { JobLevel, jobLevelToOrdering } from "../Level/jobLevelData";
import { hasStrengthTeamMember } from "../Recommender/personRecommenderData";
import { Compare } from "../../../Util/fp/Instances/Compare";
import { numCompareByDir, generateOrdering } from "../../../Util/sortUtils";
import { Pair } from "../../../Util/fp/Instances/Pair";
export var RelationshipStrength;
(function (RelationshipStrength) {
    RelationshipStrength["none"] = "none";
    RelationshipStrength["veryWeak"] = "veryWeak";
    RelationshipStrength["weak"] = "weak";
    RelationshipStrength["medium"] = "medium";
    RelationshipStrength["strong"] = "strong";
    RelationshipStrength["veryStrong"] = "veryStrong";
})(RelationshipStrength || (RelationshipStrength = {}));
;
;
export var toDiscreteRelStrength = function (strengthAsFloat) {
    if (strengthAsFloat === void 0) { strengthAsFloat = 0; }
    return strengthAsFloat < 0.0001
        ? 0
        : strengthAsFloat >= 1
            ? 5
            : Math.floor(strengthAsFloat * 5) + 1;
};
var _b = generateOrdering(RelationshipStrength), typeToOrdering = _b.typeToOrdering, orderingToType = _b.orderingToType;
var strengthDisplay = Object.freeze((_a = {},
    _a[RelationshipStrength.none] = "None",
    _a[RelationshipStrength.veryWeak] = "Very Weak",
    _a[RelationshipStrength.weak] = "Weak",
    _a[RelationshipStrength.medium] = "Medium",
    _a[RelationshipStrength.strong] = "Strong",
    _a[RelationshipStrength.veryStrong] = "Very Strong",
    _a));
export var strengthToText = function (strength) { return option.of(strengthDisplay[strength]).getOrElse(function () { return strengthDisplay.none; }); };
export var strengthOrderingToText = function (ordering) {
    if (ordering === void 0) { ordering = 0; }
    return orderingToType(ordering).chain(function (strength) { return option.of(strengthDisplay[strength]); }).getOrElse(function () { return strengthDisplay.none; });
};
export var strengthToOrdering = function (strength) { return typeToOrdering(strength).getOrElse(function () { return 0; }); };
export var strengthOrderingToStrength = function (ordering) {
    if (ordering === void 0) { ordering = 0; }
    return orderingToType(ordering).getOrElse(function () { return RelationshipStrength.none; });
};
/* extract functions, maybe use lenses later? */
var interactionsStrength = function (is) { return option.of(is.strength).getOrElse(function () { return RelationshipStrength.none; }); };
var interactionsStrengthMaxStrength = function (is) { return Pair.of(option.of(is.strength).getOrElse(function () { return RelationshipStrength.none; }), option.of(is.maxStrength).getOrElse(function () { return RelationshipStrength.none; })); };
var interactionsActiveRelationships = function (is) { return option.of(is.activeRelationships).getOrElse(function () { return 0; }); };
var allInteractionsDates = function (is) { return [
    option.of(is.lastInbound).getOrElse(function () { return ""; }),
    option.of(is.lastOutbound).getOrElse(function () { return ""; }),
    option.of(is.lastMeeting).getOrElse(function () { return ""; }),
].filter(Boolean); };
var latestDate = function (dates) { return max.apply(void 0, __spread(dates)); };
var ownInteractions = function (p) { return option.of(p.interactions).getOrElse(function () { return ({}); }); };
var teamInteractions = function (p) { return option.of(p.teamInteractions).getOrElse(function () { return ({}); }); };
/* relationship filters */
export var isStrongRelationship = function (strength) {
    if (strength === void 0) { strength = 0; }
    return strength >= 4;
};
export var isActiveRelationship = function (strength) {
    if (strength === void 0) { strength = 0; }
    return strength < 4 && strength > 0;
};
var hasStrength = Pred.of(function (s) { return s !== RelationshipStrength.none; });
var hasInteractionsStrength = hasStrength.contramap(interactionsStrength);
export var hasOwnStrength = hasInteractionsStrength.contramap(ownInteractions);
export var hasTeamStrength = hasInteractionsStrength.contramap(teamInteractions);
export var hasStrongTeamRelationship = Pred.of(isStrongRelationship)
    .contramap(strengthToOrdering)
    .contramap(interactionsStrength)
    .contramap(teamInteractions);
export var hasWeakTeamRelationship = Pred.not(hasStrongTeamRelationship);
export var isWeakenedTeamRelationship = Pred.of(function (strengthAndMaxStrength) { return strengthAndMaxStrength.merge(function (strength, maxStrength) { return strength !== maxStrength; }); })
    .contramap(interactionsStrengthMaxStrength)
    .contramap(teamInteractions);
export var isSlippingTeamRelationship = function (slippingDays, today) {
    if (slippingDays === void 0) { slippingDays = 14; }
    if (today === void 0) { today = new Date(); }
    return Pred.of(function (latestDate) { return differenceInCalendarDays(today, latestDate) > slippingDays; })
        .contramap(latestDate)
        .contramap(allInteractionsDates)
        .contramap(teamInteractions);
};
export var hasTeamContact = Pred.of(function (contactDates) { return contactDates.length > 0; })
    .contramap(allInteractionsDates)
    .contramap(teamInteractions);
export var minLevel = function (minLevel) {
    if (minLevel === void 0) { minLevel = jobLevelToOrdering(JobLevel.unknown); }
    return function (p) {
        return tryCatch(function () { return p.level; })
            .map(function (l) { return jobLevelToOrdering(l) <= minLevel; })
            .getOrElse(function () { return false; });
    };
};
export var isExec = Pred.of(minLevel(jobLevelToOrdering(JobLevel.vicepresident)));
export var isExecRelationship = function (p) {
    return hasTeamStrength.concat(isExec).run(p);
};
export var newExec = function (minimum) {
    if (minimum === void 0) { minimum = jobLevelToOrdering(JobLevel.vicepresident); }
    return function (p) {
        return Pred.not(hasTeamStrength).concat(Pred.of(minLevel(minimum))).run(p);
    };
};
/* relationship sorts */
var byStrength = Compare.of(numCompareByDir(false))
    .contramap(strengthToOrdering)
    .contramap(interactionsStrength);
export var byTeamStrength = byStrength
    .contramap(teamInteractions);
var byActiveRelationships = Compare.of(numCompareByDir(false))
    .contramap(interactionsActiveRelationships);
export var byTeamActiveRelationships = byActiveRelationships
    .contramap(teamInteractions);
var slippingDays = { start: 14, end: 210 };
export var relationshipRisks = function (entity, today) {
    if (today === void 0) { today = new Date(); }
    var _a = entity.teamInteractions, teamInteractions = _a === void 0 ? {} : _a;
    var _b = teamInteractions.lastInbound, lastInbound = _b === void 0 ? "" : _b, _c = teamInteractions.lastOutbound, lastOutbound = _c === void 0 ? "" : _c, _d = teamInteractions.lastMeeting, lastMeeting = _d === void 0 ? "" : _d, _e = teamInteractions.maxStrength, maxStrength = _e === void 0 ? RelationshipStrength.none : _e, _f = teamInteractions.strength, strength = _f === void 0 ? RelationshipStrength.none : _f, _g = teamInteractions.strongRelationships, strongRelationships = _g === void 0 ? 0 : _g, _h = teamInteractions.activeRelationships, activeRelationships = _h === void 0 ? 0 : _h;
    var communicationDates = [lastInbound, lastOutbound, lastMeeting].filter(Boolean).map(toUTCDate);
    var lastCommunication = communicationDates.length ? max.apply(void 0, __spread(communicationDates)) : "";
    var lastCommDisplay = lastCommunication
        ? isToday(lastCommunication)
            ? "today"
            : distanceInWordsStrict(today, startOfDay(lastCommunication), {
                addSuffix: true,
                partialMethod: "floor",
            })
        : "no communication";
    var lastCommunicationDays = differenceInCalendarDays(today, lastCommunication);
    var slipping = !lastCommunication ||
        (lastCommunicationDays >= slippingDays.start && lastCommunicationDays <= slippingDays.end);
    var weakened = maxStrength !== strength;
    var singleThreaded = strongRelationships === 1;
    var notStrong = strongRelationships === 0;
    var riskCount = activeRelationships > 0 ? [singleThreaded || notStrong, slipping].filter(Boolean).length : 0;
    var exec = minLevel(jobLevelToOrdering(JobLevel.vicepresident))(entity);
    var strong = strongRelationships > 1;
    var active = activeRelationships > 0;
    return {
        lastCommunication: lastCommunication,
        lastCommDisplay: lastCommDisplay,
        slipping: slipping,
        weakened: weakened,
        singleThreaded: singleThreaded,
        notStrong: notStrong,
        riskCount: riskCount,
        exec: exec,
        strong: strong,
        active: active,
    };
};
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
export var formatRelationshipsData = function (type, people) {
    if (type === void 0) { type = "person"; }
    return Task.of(people)
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
        return (e.uri === strengthTeamMember.uri || (!(type === "person") && !activeRelationships))
            ? undefined
            : (_b = {
                    uri: e.uri
                },
                _b[type] = e,
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
        .filter(function (uc) { return uc && ((type === "person") ? uc.strength > 0 : uc.networkHealthScore.active > 0); }); })
        .filter(function (ucs) { return ucs && ucs.length > 0; }); })
        .map(function (userConnections) {
        if (userConnections === void 0) { userConnections = []; }
        var initialData = {
            users: {},
            people: {},
            companies: {},
            links: [],
            levels: new Map(),
            roles: new Map(),
        };
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
    });
};
//# sourceMappingURL=relationshipData.js.map