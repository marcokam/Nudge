import { isBefore } from "date-fns";
import { Person, Interactions } from "../NudgeInterfaces";
import { List } from "~/Util/fp/Instances/List";
import { option } from "~/Util/fp/Instances/Option";
import { isNotNull } from "~/Util/fp/function";
import { RelationshipStrength } from "../Person/Relationship/relationshipData";

enum CommunicationMedium {
    email = "email",
    meeting = "meeting",
}
enum CommunicationDirection {
    inbound = "inbound",
    outbound = "outbound",
    meeting = "meeting",
}
interface CommunicationProps {
    type: Extract<keyof Interactions, "lastInbound" | "lastOutbound" | "lastMeeting" | "nextMeeting">;
    medium: CommunicationMedium;
    direction: CommunicationDirection;
    teamMember: Extract<keyof Interactions, "lastInboundTeamMember" | "lastOutboundTeamMember" | "lastMeetingTeamMember" | "nextMeetingTeamMember">;
    person: Extract<keyof Interactions, "lastInboundPerson" | "lastOutboundPerson" | "lastMeetingPerson" | "nextMeetingPerson">;
}
export type Communication = Pick<CommunicationProps, "type" | "medium" | "direction"> & {
    date: string;
    teamMember: Partial<Person> | undefined;
    person: Partial<Person> | undefined;
}
interface Relationship {
    strength: RelationshipStrength;
    strengthTeamMember: Partial<Person>;
    strengthPerson: Partial<Person>;
}

const communicationProps: readonly CommunicationProps[] = [
    { type: "lastInbound", medium: CommunicationMedium.email, direction: CommunicationDirection.inbound, teamMember: "lastInboundTeamMember", person: "lastInboundPerson" },
    { type: "lastOutbound", medium: CommunicationMedium.email, direction: CommunicationDirection.outbound, teamMember: "lastOutboundTeamMember", person: "lastOutboundPerson" },
    { type: "lastMeeting", medium: CommunicationMedium.meeting, direction: CommunicationDirection.meeting, teamMember: "lastMeetingTeamMember", person: "lastMeetingPerson" },
    { type: "nextMeeting", medium: CommunicationMedium.meeting, direction: CommunicationDirection.meeting, teamMember: "nextMeetingTeamMember", person: "nextMeetingPerson" },
];
const extractCommunications = (is: Interactions = {}, defaultPerson?: Partial<Person>) =>
    communicationProps.map((c) => option.of(is[c.type])
        .map(date => ({ ...c, date, teamMember: is[c.teamMember], person: is[c.person] || defaultPerson }))
        .getOrElse(() => undefined))
        .filter<Communication>(isNotNull);

export const getAllCommunications = (people: Partial<Person>[]) =>
    List.fromArray(people)
        .chain(p => List.fromArray(extractCommunications(p.teamInteractions, p)))
        .toArray();
export const getLastCommunication = (groups: Communication[]) =>
    groups.reduce((acc, group) => acc.date
        ? isBefore(group.date, new Date()) && isBefore(acc.date, group.date)
            ? group
            : acc
        : group, {} as unknown as Communication);
