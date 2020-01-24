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
import { isBefore } from "date-fns";
import { List } from "../../Util/fp/Instances/List";
import { option } from "../../Util/fp/Instances/Option";
import { isNotNull } from "../../Util/fp/function";
var CommunicationMedium;
(function (CommunicationMedium) {
    CommunicationMedium["email"] = "email";
    CommunicationMedium["meeting"] = "meeting";
})(CommunicationMedium || (CommunicationMedium = {}));
var CommunicationDirection;
(function (CommunicationDirection) {
    CommunicationDirection["inbound"] = "inbound";
    CommunicationDirection["outbound"] = "outbound";
    CommunicationDirection["meeting"] = "meeting";
})(CommunicationDirection || (CommunicationDirection = {}));
var communicationProps = [
    { type: "lastInbound", medium: CommunicationMedium.email, direction: CommunicationDirection.inbound, teamMember: "lastInboundTeamMember", person: "lastInboundPerson" },
    { type: "lastOutbound", medium: CommunicationMedium.email, direction: CommunicationDirection.outbound, teamMember: "lastOutboundTeamMember", person: "lastOutboundPerson" },
    { type: "lastMeeting", medium: CommunicationMedium.meeting, direction: CommunicationDirection.meeting, teamMember: "lastMeetingTeamMember", person: "lastMeetingPerson" },
    { type: "nextMeeting", medium: CommunicationMedium.meeting, direction: CommunicationDirection.meeting, teamMember: "nextMeetingTeamMember", person: "nextMeetingPerson" },
];
var extractCommunications = function (is, defaultPerson) {
    if (is === void 0) { is = {}; }
    return communicationProps.map(function (c) { return option.of(is[c.type])
        .map(function (date) { return (__assign(__assign({}, c), { date: date, teamMember: is[c.teamMember], person: is[c.person] || defaultPerson })); })
        .getOrElse(function () { return undefined; }); })
        .filter(isNotNull);
};
export var getAllCommunications = function (people) {
    return List.fromArray(people)
        .chain(function (p) { return List.fromArray(extractCommunications(p.teamInteractions, p)); })
        .toArray();
};
export var getLastCommunication = function (groups) {
    return groups.reduce(function (acc, group) { return acc.date
        ? isBefore(group.date, new Date()) && isBefore(acc.date, group.date)
            ? group
            : acc
        : group; }, {});
};
//# sourceMappingURL=InteractionsData.js.map