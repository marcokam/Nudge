import { Person, Interactions } from "../NudgeInterfaces";
declare enum CommunicationMedium {
    email = "email",
    meeting = "meeting"
}
declare enum CommunicationDirection {
    inbound = "inbound",
    outbound = "outbound",
    meeting = "meeting"
}
interface CommunicationProps {
    type: Extract<keyof Interactions, "lastInbound" | "lastOutbound" | "lastMeeting" | "nextMeeting">;
    medium: CommunicationMedium;
    direction: CommunicationDirection;
    teamMember: Extract<keyof Interactions, "lastInboundTeamMember" | "lastOutboundTeamMember" | "lastMeetingTeamMember" | "nextMeetingTeamMember">;
    person: Extract<keyof Interactions, "lastInboundPerson" | "lastOutboundPerson" | "lastMeetingPerson" | "nextMeetingPerson">;
}
export declare type Communication = Pick<CommunicationProps, "type" | "medium" | "direction"> & {
    date: string;
    teamMember: Partial<Person> | undefined;
    person: Partial<Person> | undefined;
};
export declare const getAllCommunications: (people: Partial<Person>[]) => Communication[];
export declare const getLastCommunication: (groups: Communication[]) => Communication;
export {};
