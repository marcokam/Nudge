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
import React, { useState, useRef, useCallback, useMemo, Fragment } from "react";
import { entries } from "../../../Util/fp/object";
import { noop } from "../../../Util/fp/function";
import { List } from "../../../Util/fp/Instances/List";
import { apiStates } from "../../../Util/apiUtils";
import { Compare } from "../../../Util/fp/Instances/Compare";
import { numCompareByDir } from "../../../Util/sortUtils";
import { option, tryCatch } from "../../../Util/fp/Instances/Option";
import { simplePlural } from "../../../Util/nameUtils";
import { strengthToText, RelationshipStrength } from "../../../Data/Person/Relationship/relationshipData";
import { recommendedSort } from "../../../Data/Person/Recommender/personRecommenderData";
import { byRoleGroupName } from "../../../Data/Person/Role/jobRoleData";
import { JobLevelDisplay } from "../../../Data/Person/Level/jobLevelData";
import { WiFiIcon } from "../../Icons/Icons";
import { PersonSummary } from "../../Person/PersonSummary";
import { Tooltip } from "../../UI/Tooltip/Tooltip";
import { flaggedDataReason } from "../../../Data/Person/Metadata/flagData";
;
var formatRole = function (role) {
    if (role === void 0) { role = ""; }
    return role.replace(/ /g, "_");
};
var getPersonId = function (personUri) { return personUri.replace(/\//g, "_"); };
export var OrgChart = function (_a) {
    var onScroll = _a.onScroll, apiState = _a.apiState, count = _a.count, allRoles = _a.allRoles, allPeople = _a.allPeople, allRolesOrdering = _a.allRolesOrdering, _b = __read(_a.cells, 2), cellSelected = _b[0], setCellSelected = _b[1], cellFooter = _a.cellFooter, _c = __read(_a.open, 2), cellOpen = _c[0], setCellOpen = _c[1], PersonProfile = _a.PersonProfile, cache = _a.cache, _d = _a.peoplePerCell, peoplePerCell = _d === void 0 ? 4 : _d, _e = _a.ignoreTeamInteractions, ignoreTeamInteractions = _e === void 0 ? false : _e, _f = _a.flaggedUris, flaggedUris = _f === void 0 ? {} : _f, _g = _a.flagUri, flagUri = _g === void 0 ? noop : _g;
    var _h = __read(useState(), 2), showPersonSummary = _h[0], setShowPersonSummary = _h[1];
    var scrollRef = useRef(null);
    var hideSummary = function () {
        setShowPersonSummary(null);
    };
    var showSummary = function (person) { return function () {
        setShowPersonSummary(React.createElement(Tooltip, { parent: scrollRef.current, targetSelector: "#" + getPersonId(person.uri), hide: hideSummary, className: "bg-white z-5 relative" },
            React.createElement("span", { className: "absolute pa3 pointer black-60 hover-bold f4", style: { top: 0, right: 0 }, onClick: hideSummary }, "\u2715"),
            React.createElement(PersonSummary, { person: person, PersonProfile: PersonProfile, cache: cache, flaggedUris: flaggedUris, flagUri: function (prefix, reason) {
                    flagUri(prefix, reason);
                    if (reason === flaggedDataReason.incorrectCompany) {
                        hideSummary();
                    }
                } })));
    }; };
    var navigateToCell = useCallback(function (key, cb) {
        setCellSelected(key);
        // These should probably be IO.of
        return option.of(function (n) {
            var scrollContainer;
            var scrollTimeout;
            var handler = function () {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function () {
                    if (cb)
                        cb({ currentTarget: n });
                    if (scrollRef.current) {
                        scrollContainer = scrollRef.current;
                        scrollContainer.removeEventListener("scroll", handler);
                    }
                }, 200);
            };
            if (scrollRef.current) {
                scrollContainer = scrollRef.current;
                scrollContainer.addEventListener("scroll", handler);
                handler();
            }
            n.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "center",
            });
            return n;
        })
            .ap(option.of(document.querySelector("#" + key)))
            .getOrElse(function () { return undefined; });
    }, [setCellSelected]);
    var risks = useMemo(function () {
        var _a;
        return (_a = {},
            _a["Weakening Exec Relationships"] = allPeople
                .filter(function (_a) {
                var _b = __read(_a, 1), displayLevel = _b[0];
                return displayLevel === JobLevelDisplay["C-Level"] || displayLevel === JobLevelDisplay.VP;
            })
                .reduce(function (acc, _a) {
                var _b = __read(_a, 2), _ = _b[0], byRole = _b[1];
                return acc.concat(List.fromArray(entries(byRole))
                    .chain(function (_a) {
                    var _b = __read(_a, 2), _ = _b[0], people = _b[1];
                    return List.fromArray(people);
                })
                    .toArray());
            }, [])
                .filter(function (e) {
                return tryCatch(function () { return e.risks; })
                    .map(function (risks) { return risks.exec && risks.weakened; })
                    .getOrElse(function () { return false; });
            })
                .sort(recommendedSort(byRoleGroupName(allRolesOrdering)).run),
            _a);
    }, [allPeople, allRolesOrdering]);
    var tagClasses = "ba b--red br-pill ph2 red f6 fw6 no-user-select nowrap";
    return (React.createElement(Fragment, null,
        entries(risks).map(function (_a) {
            var _b = __read(_a, 2), riskName = _b[0], people = _b[1];
            return (React.createElement("div", { key: riskName, className: "flex items-center bg-nudge-lightest-red mw-100 overflow-x-auto overflow-y-hidden bb b--black-10" },
                people.length > 0 && React.createElement("div", { className: "sticky h-100 flex items-center bg-nudge-lightest-red ph3 br b--black-10", style: { left: 0 } },
                    React.createElement("span", { className: tagClasses }, riskName)),
                people.map(function (p) { return (React.createElement("div", { key: p.uri, title: "Click to review", className: "pointer pa3 link hover-bg-nudge-light-blue br b--black-10", onClick: function () {
                        navigateToCell(getPersonId(p.uri), showSummary(p));
                    } },
                    React.createElement(PersonProfile, { name: p.name, title: p.title, imageTitle: "Click to review", className: "mw4" }),
                    tryCatch(function () {
                        var _a = p.teamInteractions, teamInteractions = _a === void 0 ? {} : _a;
                        var _b = teamInteractions.strength, strength = _b === void 0 ? RelationshipStrength.none : _b, _c = teamInteractions.maxStrength, maxStrength = _c === void 0 ? RelationshipStrength.none : _c;
                        return { strength: strengthToText(strength), maxStrength: strengthToText(maxStrength) };
                    }).map(function (_a) {
                        var strength = _a.strength, maxStrength = _a.maxStrength;
                        return (React.createElement("div", { className: "flex f7 nowrap" },
                            React.createElement("div", null,
                                React.createElement("span", { className: "red fw6 nowrap mr1" }, maxStrength),
                                "\u2192",
                                React.createElement("span", { className: "red fw6 nowrap ml1" }, strength))));
                    }).getOrElse(function () { return null; }))); })));
        }),
        React.createElement("div", { ref: scrollRef, onScroll: onScroll, className: "overflow-auto relative h-100" },
            showPersonSummary,
            React.createElement("table", { className: "collapse glow " + (apiState === apiStates.fetching ? "o-70" : "") },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "sticky z-3 bg-white bb br b--black-10 fw6", style: { top: 0, left: 0 } },
                            React.createElement("span", { className: "flex justify-center sticky nowrap ba b--white", style: { top: 0 } },
                                count,
                                " ",
                                simplePlural(count, "contact"))),
                        allRoles
                            .map(function (role) { return [role, formatRole(role)]; })
                            .map(function (_a) {
                            var _b = __read(_a, 2), role = _b[0], roleNoSpaces = _b[1];
                            return (React.createElement("th", { key: "header_" + role, className: "sticky z-2 bg-white bb br bl b--black-10", style: { top: 0 }, id: "header_" + roleNoSpaces },
                                React.createElement("span", { className: "flex justify-center ph2 pv1 white-90 nowrap no-user-select bg-dark-green ba b--dark-green" }, role)));
                        }))),
                React.createElement("tbody", null, allPeople
                    .map(function (_a) {
                    var _b = __read(_a, 2), level = _b[0], _c = _b[1], roles = _c === void 0 ? {} : _c;
                    return ({ level: level, roles: roles, roleEntries: Object.entries(roles) });
                })
                    .map(function (_a) {
                    var level = _a.level, roles = _a.roles, roleEntries = _a.roleEntries;
                    return ({
                        level: level,
                        roles: roles,
                        rolesCount: roleEntries.reduce(function (acc, _a) {
                            var _b = __read(_a, 2), _ = _b[0], _c = _b[1], people = _c === void 0 ? [] : _c;
                            return acc + people.length;
                        }, 0),
                        sortedRolesEntries: roleEntries
                            .sort(Compare.of(numCompareByDir(true))
                            .contramap(function (_a) {
                            var _b = __read(_a, 1), role = _b[0];
                            return allRolesOrdering[role];
                        }).run)
                    });
                })
                    .map(function (_a) {
                    var level = _a.level, roles = _a.roles, rolesCount = _a.rolesCount, sortedRolesEntries = _a.sortedRolesEntries;
                    return (React.createElement("tr", { key: level },
                        React.createElement("td", { className: "sticky collapse z-1 bg-white v-top fw6 bt bb b--black-10", style: { left: 0 } },
                            React.createElement("span", { className: "flex z-2 justify-center sticky ph2 pv1 white-90 nowrap no-user-select bg-purple ba b--purple", style: { top: 31 } },
                                level,
                                " (",
                                rolesCount,
                                ")"),
                            React.createElement("span", { className: "flex flex-column z-1" }, sortedRolesEntries
                                .map(function (_a) {
                                var _b = __read(_a, 2), role = _b[0], _c = _b[1], people = _c === void 0 ? [] : _c;
                                return [role, people, formatRole(role)];
                            })
                                .map(function (_a) {
                                var _b = __read(_a, 3), role = _b[0], people = _b[1], roleNoSpaces = _b[2];
                                return ({
                                    key: level + "_" + roleNoSpaces,
                                    role: role,
                                    roleCount: people.length,
                                    teamRelsCount: people.filter(function (p) { return p.hasTeamInteraction; }).length,
                                    hasTeamInteraction: people.some(function (p) { return p.hasTeamInteraction; }),
                                });
                            })
                                .map(function (_a) {
                                var key = _a.key, role = _a.role, roleCount = _a.roleCount, teamRelsCount = _a.teamRelsCount, hasTeamInteraction = _a.hasTeamInteraction;
                                return (React.createElement("div", { key: key + "_summary", className: "relative z-1 f6 fw5 ph2 pv1 white-90 nowrap no-user-select pointer ba " + ((ignoreTeamInteractions || hasTeamInteraction) ? "bg-green" : "bg-dark-green o-40") + " " + (key === cellSelected ? "b--red" : "b--dark-green"), onClick: function () { return navigateToCell(key); } },
                                    React.createElement("div", { className: "z-0 absolute absolute--fill bg-dark-green", style: { width: teamRelsCount / roleCount * 100 + "%" } }),
                                    React.createElement("div", { className: "z-1 relative flex justify-between" },
                                        React.createElement("span", { className: "mr2" }, role),
                                        React.createElement("span", null, roleCount))));
                            }))),
                        allRoles
                            .map(function (role) { return [role, formatRole(role)]; })
                            .map(function (_a) {
                            var _b = __read(_a, 2), role = _b[0], roleNoSpaces = _b[1];
                            return ({
                                key: level + "_" + roleNoSpaces,
                                people: roles[role],
                            });
                        })
                            .map(function (_a) {
                            var key = _a.key, people = _a.people;
                            return (React.createElement("td", { key: key, className: "relative collapse pa1 v-top ba b--black-10 " + (!people ? "bg-near-white" : "") },
                                React.createElement("div", { className: "flex flex-column relative ba " + (key === cellSelected ? "b--red" : "b--transparent") },
                                    React.createElement("span", { id: key, className: "absolute", style: { top: -40 } }),
                                    option
                                        .of(people)
                                        .map(function (people) { return (React.createElement(React.Fragment, { key: key + "_wrapper" },
                                        React.createElement("div", { className: "overflow-y-hidden", style: {
                                                transition: "max-height 0.3s ease-in-out",
                                                maxHeight: cellOpen[key]
                                                    ? 51 * people.length
                                                    : 51 * 4,
                                            } }, people.map(function (p) {
                                            var _a = p.uri, uri = _a === void 0 ? "" : _a, _b = p.name, name = _b === void 0 ? "" : _b, _c = p.title, title = _c === void 0 ? "" : _c, _d = p.imageUrl, imageUrl = _d === void 0 ? "" : _d, _e = p.strength, strength = _e === void 0 ? RelationshipStrength.none : _e, _f = p.hasTeamInteraction, hasTeamInteraction = _f === void 0 ? false : _f;
                                            var flagged = !!flaggedUris[uri];
                                            var selectedClass = getPersonId(uri) === cellSelected ? "ba b--red" : "";
                                            var flaggedClass = flagged ? "bg-nudge-highlight-background" : "hover-bg-nudge-light-blue";
                                            var interactedClass = !flagged && (ignoreTeamInteractions || hasTeamInteraction) ? "" : "o-40";
                                            return (React.createElement("div", { className: "flex items-center pr1 bg-animate " + selectedClass + " " + flaggedClass, key: uri, id: getPersonId(uri), style: { width: 290, height: 51 }, onClick: showSummary(p) },
                                                React.createElement(PersonProfile, { size: 30, name: name, title: title, imageUrl: imageUrl, className: "pv2 ph1 glow w5 pointer " + interactedClass }),
                                                hasTeamInteraction && (React.createElement(WiFiIcon, { type: "collab", level: strength }))));
                                        })),
                                        people.length > peoplePerCell && (React.createElement(React.Fragment, null,
                                            React.createElement("a", { className: "db tr nudge-blue link pointer f6 ph2", onClick: function () {
                                                    setCellOpen(function (prevOpen) {
                                                        var _a;
                                                        return (__assign(__assign({}, prevOpen), (_a = {}, _a[key] = !prevOpen[key], _a)));
                                                    });
                                                } }, cellOpen[key] ? "Less" : "More"),
                                            cellFooter)))); })
                                        .getOrElse(function () { return null; }))));
                        })));
                }))))));
};
//# sourceMappingURL=OrgChart.js.map