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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import React from "react";
import { format, isSameDay, isSameYear } from "date-fns";
import { dateCompare } from "../../Util/sortUtils";
import { groupBy } from "../../Util/fp/array";
import { compose } from "../../Util/fp/function";
import { tryCatch } from "../../Util/fp/Instances/Option";
import { Compare } from "../../Util/fp/Instances/Compare";
import { MeetingIcon } from "../Icons/MeetingIcon";
import { InboundOutboundIcon, ioTypes } from "../Icons/InboundOutboundIcon";
import { mapEntries, propOr } from "../../Util/fp/object";
import { toUTCDate } from "../../Util/dateUtils";
;
var groupInteractions = function (defaultUri) { return compose(function (interactions) { return interactions
    .sort(Compare.of(dateCompare(false))
    .contramap(function (_a) {
    var _b = __read(_a, 2), _ = _b[0], is = _b[1];
    return tryCatch(function () { return is[0].date; }).getOrElse(function () { return "1900-01-01"; });
})
    .run); }, mapEntries(function (uri, interactions) {
    return [uri, interactions.map(function (i) { return (__assign(__assign({}, i), { displayDate: isSameYear(new Date(), i.date) ? format(i.date, "MMM D") : format(i.date, "MMM D YYYY") })); })];
}), groupBy(function (_a) {
    var teammate = _a.teammate, contact = _a.contact;
    return (contact && contact.uri && contact.uri + "_" + (teammate && teammate.uri)) || (teammate && teammate.uri) || defaultUri;
})); };
export var TeamInteractions = function (_a) {
    var interactions = _a.interactions, PersonProfile = _a.PersonProfile, _b = _a.person, person = _b === void 0 ? {} : _b;
    var _c = interactions.lastInboundTeamMember, lastInboundTeamMember = _c === void 0 ? {} : _c, _d = interactions.lastInboundPerson, lastInboundPerson = _d === void 0 ? {} : _d, _e = interactions.lastOutboundTeamMember, lastOutboundTeamMember = _e === void 0 ? {} : _e, _f = interactions.lastOutboundPerson, lastOutboundPerson = _f === void 0 ? {} : _f, _g = interactions.lastMeetingTeamMember, lastMeetingTeamMember = _g === void 0 ? {} : _g, _h = interactions.lastMeetingPerson, lastMeetingPerson = _h === void 0 ? {} : _h, _j = interactions.lastInbound, inbound = _j === void 0 ? "" : _j, _k = interactions.lastOutbound, outbound = _k === void 0 ? "" : _k, _l = interactions.lastMeeting, meeting = _l === void 0 ? "" : _l;
    var _m = __read([inbound, outbound, meeting].map(function (d) { return d === "" ? "" : toUTCDate(d); }), 3), lastInbound = _m[0], lastOutbound = _m[1], lastMeeting = _m[2];
    var sortedInteractions = groupInteractions(person.uri || "")(__spread((isSameDay(lastInbound, lastOutbound) && lastInboundTeamMember.uri === lastOutboundTeamMember.uri
        ? [{ type: "Conversation", date: lastInbound, teammate: lastInboundTeamMember.uri ? lastInboundTeamMember : person, contact: lastInboundPerson }]
        : [
            { type: "Inbound", date: lastInbound, teammate: lastInboundTeamMember.uri ? lastInboundTeamMember : person, contact: lastInboundPerson },
            { type: "Outbound", date: lastOutbound, teammate: lastOutboundTeamMember.uri ? lastOutboundTeamMember : person, contact: lastOutboundPerson },
        ]), [
        { type: "Meeting", date: lastMeeting, teammate: lastMeetingTeamMember, contact: lastMeetingPerson },
    ]).filter(function (_a) {
        var date = _a.date;
        return Boolean(date);
    })
        .filter(function (_a) {
        var teammate = _a.teammate, contact = _a.contact;
        return !(teammate && contact && (teammate.uri && contact.uri) && (teammate.uri == contact.uri));
    })
        .sort(Compare.of(dateCompare(false))
        .contramap(propOr("date", ""))
        .run));
    var isTeam = lastInboundTeamMember.uri || lastOutboundTeamMember.uri || lastMeetingTeamMember.uri;
    return ((lastInbound || lastOutbound || lastMeeting) ? (React.createElement("section", { className: "f6" },
        React.createElement("h1", { className: "mv1 f5 fw5" },
            isTeam ? "Team " : "",
            "Interactions"),
        React.createElement("table", { className: "collapse center truncate", cellSpacing: "0" },
            React.createElement("tbody", { className: "lh-copy truncate" }, sortedInteractions.map(function (_a) {
                var _b = __read(_a, 2), uri = _b[0], interactions = _b[1];
                var _c = __read(interactions, 1), _d = _c[0], teammate = _d.teammate, contact = _d.contact;
                return (React.createElement("tr", { key: uri },
                    React.createElement("td", { className: "pr2" }, contact && contact.uri && React.createElement(PersonProfile, { size: 30, className: "mw5", name: contact.name || "", title: contact.title || "", imageUrl: contact.imageUrl || "" })),
                    React.createElement("td", { className: "pr2" }, interactions.map(function (_a) {
                        var type = _a.type, date = _a.date, displayDate = _a.displayDate;
                        return React.createElement(React.Fragment, { key: type + "_" + date },
                            type === "Meeting" && React.createElement("div", { className: "flex items-center" },
                                React.createElement("span", { className: "f7 nowrap w3 pr2" }, displayDate),
                                React.createElement("div", { className: "flex justify-center mv1", title: "meeting", style: { width: 41 } },
                                    React.createElement(MeetingIcon, { fill: "#1a9bfc", style: { width: "15px", height: "15px" } }))),
                            type === "Conversation" && React.createElement("div", { className: "flex items-center" },
                                React.createElement("span", { className: "f7 nowrap w3 pr2" }, displayDate),
                                React.createElement(InboundOutboundIcon, { type: ioTypes.conversation, className: "flex items-center" })),
                            type === "Inbound" && React.createElement("div", { className: "flex items-center" },
                                React.createElement("span", { className: "f7 nowrap w3 pr2" }, displayDate),
                                React.createElement(InboundOutboundIcon, { type: ioTypes.inboundFlipped, className: "flex items-center" })),
                            type === "Outbound" && React.createElement("div", { className: "flex items-center" },
                                React.createElement("span", { className: "f7 nowrap w3 pr2" }, displayDate),
                                React.createElement(InboundOutboundIcon, { type: ioTypes.outboundFlipped, className: "flex items-center" })));
                    })),
                    React.createElement("td", null, teammate && teammate.uri && teammate.uri !== person.uri && React.createElement(PersonProfile, { size: 30, className: "mw5", name: teammate.name || "", title: teammate.title || "", imageUrl: teammate.imageUrl || "" }))));
            }))))) : null);
};
//# sourceMappingURL=TeamInteractions.js.map