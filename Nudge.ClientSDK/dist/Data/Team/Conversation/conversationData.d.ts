import { Cache } from "../../DataInterfaces";
import { Task } from "../../../Util/fp/Instances/Task";
interface Entity {
    uri: string;
}
interface Conversation {
    user: Entity;
    contact: Entity;
}
interface MapByEntity {
    [uri: string]: {
        [uri: string]: {
            outreachCount: boolean;
            response: boolean;
            meeting: boolean;
            lastInbound: string;
            lastOutbound: string;
            lastMeeting: string;
        };
    };
}
export declare const conversationDisplayTypes: {
    user: string;
    contact: string;
};
export declare const formatCompanyTeamConversations: (people: []) => Task<unknown, ({
    user: {
        jobTitle: string | undefined;
        uri?: string | undefined;
        name?: string | undefined;
        title?: string | undefined;
        imageUrl?: string | undefined;
        identities?: import("../../NudgeInterfaces").IPersonIdentity[] | undefined;
        level?: import("../../Person/Level/jobLevelData").JobLevel | undefined;
        roles?: import("../../NudgeInterfaces").IJobRole[] | undefined;
        teamInteractions?: import("../../NudgeInterfaces").Interactions | undefined;
        interactions?: import("../../NudgeInterfaces").Interactions | undefined;
    };
    aggregateList: any[];
} | undefined)[]>;
export declare const getCompanyTeamConversations: (companyUri?: string, teamUri?: string, maxConversationDays?: number, cache?: Cache | undefined) => Task<unknown, ({
    user: {
        jobTitle: string | undefined;
        uri?: string | undefined;
        name?: string | undefined;
        title?: string | undefined;
        imageUrl?: string | undefined;
        identities?: import("../../NudgeInterfaces").IPersonIdentity[] | undefined;
        level?: import("../../Person/Level/jobLevelData").JobLevel | undefined;
        roles?: import("../../NudgeInterfaces").IJobRole[] | undefined;
        teamInteractions?: import("../../NudgeInterfaces").Interactions | undefined;
        interactions?: import("../../NudgeInterfaces").Interactions | undefined;
    };
    aggregateList: any[];
} | undefined)[]>;
export declare const generateInitialHeatmaps: (today: Date, dayRange?: number) => {
    date: Date;
    conversations: never[];
    sortedConversations: never[];
}[];
export declare const getSortedConversations: (conversations: Conversation[]) => {
    conversations: Conversation[];
    sortedConversationsByUser: {
        [k: string]: Conversation[];
    };
    sortedConversationsByContact: {
        [k: string]: Conversation[];
    };
};
export declare const formatConversations: (conversations?: never[], conversationDays?: number) => {
    heatmaps: {
        conversations: Conversation[];
        sortedConversationsByUser: {
            [k: string]: Conversation[];
        };
        sortedConversationsByContact: {
            [k: string]: Conversation[];
        };
        date: Date;
        sortedConversations: never[];
    }[];
    sortedConversations: {
        conversations: Conversation[];
        sortedConversationsByUser: {
            [k: string]: Conversation[];
        };
        sortedConversationsByContact: {
            [k: string]: Conversation[];
        };
        date: Date;
        sortedConversations: never[];
    }[];
    nextMeetings: (Conversation & {
        nextMeeting: string;
    })[];
    inboundOutboundByUser: MapByEntity;
    inboundOutboundByContact: MapByEntity;
};
export {};
