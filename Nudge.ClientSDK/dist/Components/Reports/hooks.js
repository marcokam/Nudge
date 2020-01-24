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
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { apiStates, getEntity } from "../../Util/apiUtils";
import { NudgeUris } from "../../Uris/NudgeUris";
import * as logger from "../../Logging/DefaultLogger";
export function useWeeklyActivityReport(userUri) {
    var _a = __read(useState({ apiState: apiStates.fetching }), 2), weeklyActivityReport = _a[0], setWeeklyActivityReport = _a[1];
    useEffect(function () {
        if (!userUri)
            return;
        var cancelled = false;
        if (!weeklyActivityReport.result) {
            getEntity(NudgeUris.api.aggregateAnalysis.RunWeeklyActivity(userUri)._instanceUri)
                .fork(function (err) {
                if (cancelled)
                    return;
                setWeeklyActivityReport({
                    apiState: apiStates.error,
                });
                logger.error("Error getting weekly activity report", err);
            }, function (response) {
                if (response === void 0) { response = {}; }
                if (cancelled)
                    return;
                setWeeklyActivityReport(__assign({ apiState: apiStates.fetched }, response));
            });
        }
        return function () {
            cancelled = true;
        };
    }, [setWeeklyActivityReport, userUri, weeklyActivityReport.result]);
    return [weeklyActivityReport];
}
export function useLeaderboardReport(userUri) {
    var _a = __read(useState({ apiState: apiStates.fetching }), 2), leaderboardReport = _a[0], setLeaderboardReport = _a[1];
    useEffect(function () {
        if (!userUri)
            return;
        var cancelled = false;
        if (!leaderboardReport.results) {
            getEntity(NudgeUris.api.aggregateAnalysis.RunUserLeaderboard(userUri)._instanceUri)
                .fork(function (err) {
                if (cancelled)
                    return;
                setLeaderboardReport({
                    apiState: apiStates.error,
                });
                logger.error("Error getting leaderboard report", err);
            }, function (response) {
                if (response === void 0) { response = {}; }
                if (cancelled)
                    return;
                setLeaderboardReport(__assign({ apiState: apiStates.fetched }, response));
            });
        }
        return function () {
            (cancelled = true);
        };
    }, [leaderboardReport.results, setLeaderboardReport, userUri]);
    return [leaderboardReport];
}
export function useNetworkViewReport(userUri) {
    var _a = __read(useState({ apiState: apiStates.fetching }), 2), networkViewReport = _a[0], setNetworkViewReport = _a[1];
    useEffect(function () {
        if (!userUri)
            return;
        var cancelled = false;
        getEntity(NudgeUris.api.aggregateAnalysis.RunNetworkView(userUri)._instanceUri)
            .fork(function (err) {
            if (cancelled)
                return;
            setNetworkViewReport({
                apiState: apiStates.error,
            });
            logger.error("Error getting network view report", err);
        }, function (response) {
            if (response === void 0) { response = {}; }
            if (cancelled)
                return;
            setNetworkViewReport(__assign({ apiState: apiStates.fetched }, response));
        });
        return function () {
            (cancelled = true);
        };
    }, [setNetworkViewReport, userUri]);
    return [networkViewReport];
}
export function useContactActivity(weeks) {
    if (weeks === void 0) { weeks = 0; }
    var _a = __read(useState({
        apiState: apiStates.fetching,
        newContacts: [],
        allContacts: [],
    }), 2), contactActivity = _a[0], setContactActivity = _a[1];
    useEffect(function () {
        var cancelled = false;
        getEntity(NudgeUris.v2.users().current().activities(weeks))
            .fork(function (err) {
            if (cancelled)
                return;
            setContactActivity({ apiState: apiStates.error, newContacts: [], allContacts: [] });
            logger.error("Error getting contact capture activity", err);
        }, function (response) {
            if (response === void 0) { response = []; }
            if (cancelled)
                return;
            setContactActivity({
                apiState: apiStates.fetched,
                newContacts: response.filter(function (_a) {
                    var identities = _a.identities;
                    return identities.some(function (i) { return i.isNew; });
                }),
                allContacts: response,
            });
        });
        return function () {
            cancelled = true;
        };
    }, [weeks]);
    var generateCSVContent = function () {
        var csvHeader = "data:application/csv;charset=utf-8,";
        var headers = [
            "DisplayName",
            "JobTitle",
            "MainCompanyName",
            "City",
            "State",
            "Country",
            "EmailAddress1",
            "EmailAddress2",
            "EmailAddress3",
            "Twitter",
            "LinkedIn",
            "InboundEmails",
            "LastInboundEmailDate",
            "OutboundEmails",
            "LastOutboundEmailDate",
            "Meetings",
            "LastMeetingDate",
        ]
            .map(function (c) { return "\"" + c + "\""; })
            .join(",");
        return [csvHeader.concat(headers)]
            .concat((contactActivity.allContacts || [])
            .map(function (_a) {
            var _b = _a.identities, identities = _b === void 0 ? [] : _b, restContact = __rest(_a, ["identities"]);
            return (__assign(__assign({}, restContact), { emails: identities.filter(function (i) { return i.type === "email"; }).map(function (i) { return i.identity; }), twitters: identities.filter(function (i) { return i.type === "twitter"; }).map(function (i) { return i.identity; }), linkedIns: identities.filter(function (i) { return i.type === "linkedIn"; }).map(function (i) { return i.identity; }) }));
        })
            .map(function (_a) {
            var _b = _a.name, name = _b === void 0 ? "" : _b, _c = _a.title, title = _c === void 0 ? "" : _c, company = _a.company, _d = _a.city, city = _d === void 0 ? "" : _d, _e = _a.state, state = _e === void 0 ? "" : _e, _f = _a.country, country = _f === void 0 ? "" : _f, _g = _a.emails, _h = __read(_g === void 0 ? [] : _g, 3), _j = _h[0], emailAddress1 = _j === void 0 ? "" : _j, _k = _h[1], emailAddress2 = _k === void 0 ? "" : _k, _l = _h[2], emailAddress3 = _l === void 0 ? "" : _l, _m = _a.twitters, _o = __read(_m === void 0 ? [] : _m, 1), _p = _o[0], twitter = _p === void 0 ? "" : _p, _q = _a.linkedIns, _r = __read(_q === void 0 ? [] : _q, 1), _s = _r[0], linkedIn = _s === void 0 ? "" : _s, _t = _a.inboundEmail, inboundEmail = _t === void 0 ? 0 : _t, _u = _a.lastInboundEmailDate, lastInboundEmailDate = _u === void 0 ? "" : _u, _v = _a.outboundEmail, outboundEmail = _v === void 0 ? 0 : _v, _w = _a.lastOutboundEmailDate, lastOutboundEmailDate = _w === void 0 ? "" : _w, _x = _a.meetings, meetings = _x === void 0 ? 0 : _x, _y = _a.lastMeetingDate, lastMeetingDate = _y === void 0 ? "" : _y;
            return [
                name,
                title,
                (company && company.name) || "",
                city,
                state,
                country,
                emailAddress1,
                emailAddress2,
                emailAddress3,
                twitter,
                linkedIn,
                inboundEmail,
                lastInboundEmailDate,
                outboundEmail,
                lastOutboundEmailDate,
                meetings,
                lastMeetingDate,
            ].map(function (c) { return "\"" + c + "\""; });
        })
            .map(function (r) { return r.join(","); })).join("\r\n");
    };
    var exportContactActivity = function () {
        var csvContent = generateCSVContent();
        var filename = "contact_activity_" + format(new Date(), "YYYY-MM-DD") + ".csv";
        var a = document.createElement("a");
        a.setAttribute("download", filename);
        a.setAttribute("href", csvContent);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    return [contactActivity, { generateCSVContent: generateCSVContent, exportContactActivity: exportContactActivity }];
}
export function useRelationshipViewReport(userUri) {
    var _a = __read(useState({ apiState: apiStates.fetching }), 2), relationshipViewReport = _a[0], setRelationshipViewReport = _a[1];
    useEffect(function () {
        if (!userUri)
            return;
        var cancelled = false;
        if (!relationshipViewReport.result) {
            getEntity(NudgeUris.api.aggregateAnalysis.RunRelationshipView(userUri)._instanceUri)
                .fork(function (err) {
                if (cancelled)
                    return;
                setRelationshipViewReport({
                    apiState: apiStates.error,
                });
                logger.error("Error getting relationship view report", err);
            }, function (response) {
                if (response === void 0) { response = {}; }
                if (cancelled)
                    return;
                setRelationshipViewReport(__assign({ apiState: apiStates.fetched }, response));
            });
        }
        return function () {
            cancelled = true;
        };
    }, [relationshipViewReport.result, setRelationshipViewReport, userUri]);
    return [relationshipViewReport];
}
//# sourceMappingURL=hooks.js.map