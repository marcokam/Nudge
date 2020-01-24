import { addDays, max, differenceInCalendarDays, isSameDay } from "date-fns";

import { Cache } from "~/Data/DataInterfaces";
import { Person } from "~/Data/NudgeInterfaces";

import { groupBy, range } from "~/Util/fp/array";
import { toUTCDate } from "~/Util/dateUtils";
import NudgeIterable from "~/Util/NudgeIterable";
import { tryCatch } from "~/Util/fp/Instances/Option";
import { mapEntries } from "~/Util/fp/object";
import { NudgeUris } from "~/Uris/NudgeUris";
import { getAllEntities } from "~/Util/apiUtils";
import { Task } from "~/Util/fp/Instances/Task";

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

export const conversationDisplayTypes = {
    user: "user",
    contact: "contact",
};

export const formatCompanyTeamConversations = (people: []) => Task.of(people)
    .map((people: Person[] = []) => NudgeIterable.fromArray(people)
        .flatMap(p => tryCatch(() => ({ ...p, jobTitle: p.title }))
            .chain(person => tryCatch(() => p.teamInteractions)
                .chain(interactions =>
                    tryCatch(() => ([
                        {
                            type: "mostRecentEmailInbound",
                            date: interactions.lastInbound,
                            user: interactions.lastInboundTeamMember,
                            person,
                        },
                        {
                            type: "mostRecentEmailOutbound",
                            date: interactions.lastOutbound,
                            user: interactions.lastOutboundTeamMember,
                            person,
                        },
                        {
                            type: "mostRecentMeeting",
                            date: interactions.lastMeeting,
                            user: interactions.lastMeetingTeamMember,
                            person,
                        },
                        {
                            type: "nextMeeting",
                            date: interactions.nextMeeting,
                            user: interactions.nextMeetingTeamMember,
                            person,
                        },
                    ].filter(i => !!i.date)))
                        .map(NudgeIterable.fromArray)))
            .getOrElse(() => NudgeIterable.fromArray([]))))
    .map(iter => iter.toArray())
    .map(groupBy(({ user = {}, person = {} }) => tryCatch(() => user.uri)
        .chain(userUri => tryCatch(() => person.uri)
            .map(personUri => `${userUri}_${personUri}`))
        .getOrElse(() => "")))
    .map(mapEntries((_, conversations) => conversations
        .reduce((acc, { type, date, user, person }) => ({
            ...acc,
            [type]: date,
            user,
            person,
        }), {} as any)))
    .map(groupBy(conversations =>
        tryCatch(() => conversations.user.uri)
            .getOrElse(() => "")))
    .map(mapEntries((_, aggregateList) =>
        tryCatch(() => aggregateList[0])
            .map(({ user }: { user: Partial<Person> }) => ({
                user: { ...user, jobTitle: user.title },
                aggregateList,
            }))
            .getOrElse(() => undefined)));


export const getCompanyTeamConversations = (companyUri = "", teamUri = "", maxConversationDays = 60, cache?: Cache) =>
    getAllEntities(NudgeUris.v2.people()._uri, {
        fields: `uri,name,title,imageUrl,teamInteractions(lastInbound,lastInboundTeamMember(uri,name,title,imageUrl),` +
            `lastOutbound,lastOutboundTeamMember(uri,name,title,imageUrl),` +
            `lastMeeting,lastMeetingTeamMember(uri,name,title,imageUrl))`,
        q: `company.uri:"${companyUri}" AND (teamInteractions.now_lastInbound:[0 TO ${maxConversationDays}] OR teamInteractions.now_lastOutbound:[0 TO ${maxConversationDays}] OR teamInteractions.now_lastMeeting:[0 TO ${maxConversationDays}])`,
        team: teamUri,
        limit: 99,
        aggregation: "none",
        hint: "analytics",
    }, { cache })
        .chain(formatCompanyTeamConversations);

export const generateInitialHeatmaps = (today: Date, dayRange = 1) =>
    range(dayRange).map(i => ({
        date: new Date(addDays(today, -i)),
        conversations: [],
        sortedConversations: [],
    }));
export const getSortedConversations = (conversations: Conversation[]) => ({
    conversations,
    sortedConversationsByUser: groupBy<Conversation>(({ user = { uri: "" } }) => user.uri)(conversations),
    sortedConversationsByContact: groupBy<Conversation>(({ contact = { uri: "" } }) => contact.uri)(conversations),
});
export const formatConversations = (conversations = [], conversationDays = 30) => {
    const today = new Date();
    const initialHeatmaps = generateInitialHeatmaps(today, conversationDays + 1);
    const inboundOutboundByUser: MapByEntity = {};
    const inboundOutboundByContact: MapByEntity = {};
    const nextMeetings: (Conversation & { nextMeeting: string })[] = [];

    conversations.forEach(({ user = { uri: "" }, aggregateList = [] }) => {
        aggregateList.forEach(
            ({ mostRecentEmailInbound = "", mostRecentEmailOutbound = "", mostRecentMeeting = "", nextMeeting = "", person: contact = { uri: "" } }) => {
                const datesByUTC = [mostRecentEmailInbound, mostRecentEmailOutbound, mostRecentMeeting]
                    .filter(Boolean)
                    .map(toUTCDate);
                const lastInteraction = max(...datesByUTC);
                const dayDiff = differenceInCalendarDays(today, lastInteraction);
                const currentMap = {
                    outreachCount: !!mostRecentEmailOutbound && isSameDay(lastInteraction, toUTCDate(mostRecentEmailOutbound)),
                    response: !!mostRecentEmailInbound && isSameDay(lastInteraction, toUTCDate(mostRecentEmailInbound)),
                    meeting: isSameDay(lastInteraction, toUTCDate(mostRecentMeeting)),
                    lastInbound: mostRecentEmailInbound,
                    lastOutbound: mostRecentEmailOutbound,
                    lastMeeting: mostRecentMeeting,
                };
                const { conversations: dayConversations = [] as Conversation[] } = initialHeatmaps[dayDiff] || {};

                if (dayConversations) {
                    dayConversations.push({
                        user,
                        contact,
                    });
                }
                inboundOutboundByUser[user.uri] = inboundOutboundByUser[user.uri] || {};
                inboundOutboundByContact[contact.uri] = inboundOutboundByContact[contact.uri] || {};
                inboundOutboundByUser[user.uri][contact.uri] = currentMap;
                inboundOutboundByContact[contact.uri][user.uri] = currentMap;

                if (nextMeeting) {
                    nextMeetings.push({
                        nextMeeting,
                        user,
                        contact,
                    })

                }
            },
        );
    });

    const heatmaps = initialHeatmaps.map(day => ({
        ...day,
        ...getSortedConversations(day.conversations),
    }));
    const sortedConversations = heatmaps.filter(({ conversations = [] }) => conversations.length > 0);

    return { heatmaps, sortedConversations, nextMeetings, inboundOutboundByUser, inboundOutboundByContact };
};
