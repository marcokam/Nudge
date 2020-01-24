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
import { addDays, max, differenceInCalendarDays, isSameDay } from "date-fns";
import { groupBy, range } from "../../../Util/fp/array";
import { toUTCDate } from "../../../Util/dateUtils";
import NudgeIterable from "../../../Util/NudgeIterable";
import { tryCatch } from "../../../Util/fp/Instances/Option";
import { mapEntries } from "../../../Util/fp/object";
import { NudgeUris } from "../../../Uris/NudgeUris";
import { getAllEntities } from "../../../Util/apiUtils";
import { Task } from "../../../Util/fp/Instances/Task";
export var conversationDisplayTypes = {
    user: "user",
    contact: "contact",
};
export var formatCompanyTeamConversations = function (people) { return Task.of(people)
    .map(function (people) {
    if (people === void 0) { people = []; }
    return NudgeIterable.fromArray(people)
        .flatMap(function (p) { return tryCatch(function () { return (__assign(__assign({}, p), { jobTitle: p.title })); })
        .chain(function (person) { return tryCatch(function () { return p.teamInteractions; })
        .chain(function (interactions) {
        return tryCatch(function () { return ([
            {
                type: "mostRecentEmailInbound",
                date: interactions.lastInbound,
                user: interactions.lastInboundTeamMember,
                person: person,
            },
            {
                type: "mostRecentEmailOutbound",
                date: interactions.lastOutbound,
                user: interactions.lastOutboundTeamMember,
                person: person,
            },
            {
                type: "mostRecentMeeting",
                date: interactions.lastMeeting,
                user: interactions.lastMeetingTeamMember,
                person: person,
            },
            {
                type: "nextMeeting",
                date: interactions.nextMeeting,
                user: interactions.nextMeetingTeamMember,
                person: person,
            },
        ].filter(function (i) { return !!i.date; })); })
            .map(NudgeIterable.fromArray);
    }); })
        .getOrElse(function () { return NudgeIterable.fromArray([]); }); });
})
    .map(function (iter) { return iter.toArray(); })
    .map(groupBy(function (_a) {
    var _b = _a.user, user = _b === void 0 ? {} : _b, _c = _a.person, person = _c === void 0 ? {} : _c;
    return tryCatch(function () { return user.uri; })
        .chain(function (userUri) { return tryCatch(function () { return person.uri; })
        .map(function (personUri) { return userUri + "_" + personUri; }); })
        .getOrElse(function () { return ""; });
}))
    .map(mapEntries(function (_, conversations) { return conversations
    .reduce(function (acc, _a) {
    var _b;
    var type = _a.type, date = _a.date, user = _a.user, person = _a.person;
    return (__assign(__assign({}, acc), (_b = {}, _b[type] = date, _b.user = user, _b.person = person, _b)));
}, {}); }))
    .map(groupBy(function (conversations) {
    return tryCatch(function () { return conversations.user.uri; })
        .getOrElse(function () { return ""; });
}))
    .map(mapEntries(function (_, aggregateList) {
    return tryCatch(function () { return aggregateList[0]; })
        .map(function (_a) {
        var user = _a.user;
        return ({
            user: __assign(__assign({}, user), { jobTitle: user.title }),
            aggregateList: aggregateList,
        });
    })
        .getOrElse(function () { return undefined; });
})); };
export var getCompanyTeamConversations = function (companyUri, teamUri, maxConversationDays, cache) {
    if (companyUri === void 0) { companyUri = ""; }
    if (teamUri === void 0) { teamUri = ""; }
    if (maxConversationDays === void 0) { maxConversationDays = 60; }
    return getAllEntities(NudgeUris.v2.people()._uri, {
        fields: "uri,name,title,imageUrl,teamInteractions(lastInbound,lastInboundTeamMember(uri,name,title,imageUrl)," +
            "lastOutbound,lastOutboundTeamMember(uri,name,title,imageUrl)," +
            "lastMeeting,lastMeetingTeamMember(uri,name,title,imageUrl))",
        q: "company.uri:\"" + companyUri + "\" AND (teamInteractions.now_lastInbound:[0 TO " + maxConversationDays + "] OR teamInteractions.now_lastOutbound:[0 TO " + maxConversationDays + "] OR teamInteractions.now_lastMeeting:[0 TO " + maxConversationDays + "])",
        team: teamUri,
        limit: 99,
        aggregation: "none",
        hint: "analytics",
    }, { cache: cache })
        .chain(formatCompanyTeamConversations);
};
export var generateInitialHeatmaps = function (today, dayRange) {
    if (dayRange === void 0) { dayRange = 1; }
    return range(dayRange).map(function (i) { return ({
        date: new Date(addDays(today, -i)),
        conversations: [],
        sortedConversations: [],
    }); });
};
export var getSortedConversations = function (conversations) { return ({
    conversations: conversations,
    sortedConversationsByUser: groupBy(function (_a) {
        var _b = _a.user, user = _b === void 0 ? { uri: "" } : _b;
        return user.uri;
    })(conversations),
    sortedConversationsByContact: groupBy(function (_a) {
        var _b = _a.contact, contact = _b === void 0 ? { uri: "" } : _b;
        return contact.uri;
    })(conversations),
}); };
export var formatConversations = function (conversations, conversationDays) {
    if (conversations === void 0) { conversations = []; }
    if (conversationDays === void 0) { conversationDays = 30; }
    var today = new Date();
    var initialHeatmaps = generateInitialHeatmaps(today, conversationDays + 1);
    var inboundOutboundByUser = {};
    var inboundOutboundByContact = {};
    var nextMeetings = [];
    conversations.forEach(function (_a) {
        var _b = _a.user, user = _b === void 0 ? { uri: "" } : _b, _c = _a.aggregateList, aggregateList = _c === void 0 ? [] : _c;
        aggregateList.forEach(function (_a) {
            var _b = _a.mostRecentEmailInbound, mostRecentEmailInbound = _b === void 0 ? "" : _b, _c = _a.mostRecentEmailOutbound, mostRecentEmailOutbound = _c === void 0 ? "" : _c, _d = _a.mostRecentMeeting, mostRecentMeeting = _d === void 0 ? "" : _d, _e = _a.nextMeeting, nextMeeting = _e === void 0 ? "" : _e, _f = _a.person, contact = _f === void 0 ? { uri: "" } : _f;
            var datesByUTC = [mostRecentEmailInbound, mostRecentEmailOutbound, mostRecentMeeting]
                .filter(Boolean)
                .map(toUTCDate);
            var lastInteraction = max.apply(void 0, __spread(datesByUTC));
            var dayDiff = differenceInCalendarDays(today, lastInteraction);
            var currentMap = {
                outreachCount: !!mostRecentEmailOutbound && isSameDay(lastInteraction, toUTCDate(mostRecentEmailOutbound)),
                response: !!mostRecentEmailInbound && isSameDay(lastInteraction, toUTCDate(mostRecentEmailInbound)),
                meeting: isSameDay(lastInteraction, toUTCDate(mostRecentMeeting)),
                lastInbound: mostRecentEmailInbound,
                lastOutbound: mostRecentEmailOutbound,
                lastMeeting: mostRecentMeeting,
            };
            var _g = (initialHeatmaps[dayDiff] || {}).conversations, dayConversations = _g === void 0 ? [] : _g;
            if (dayConversations) {
                dayConversations.push({
                    user: user,
                    contact: contact,
                });
            }
            inboundOutboundByUser[user.uri] = inboundOutboundByUser[user.uri] || {};
            inboundOutboundByContact[contact.uri] = inboundOutboundByContact[contact.uri] || {};
            inboundOutboundByUser[user.uri][contact.uri] = currentMap;
            inboundOutboundByContact[contact.uri][user.uri] = currentMap;
            if (nextMeeting) {
                nextMeetings.push({
                    nextMeeting: nextMeeting,
                    user: user,
                    contact: contact,
                });
            }
        });
    });
    var heatmaps = initialHeatmaps.map(function (day) { return (__assign(__assign({}, day), getSortedConversations(day.conversations))); });
    var sortedConversations = heatmaps.filter(function (_a) {
        var _b = _a.conversations, conversations = _b === void 0 ? [] : _b;
        return conversations.length > 0;
    });
    return { heatmaps: heatmaps, sortedConversations: sortedConversations, nextMeetings: nextMeetings, inboundOutboundByUser: inboundOutboundByUser, inboundOutboundByContact: inboundOutboundByContact };
};
//# sourceMappingURL=conversationData.js.map