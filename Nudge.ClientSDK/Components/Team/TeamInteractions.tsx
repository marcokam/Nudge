import React from "react";
import { format, isSameDay, isSameYear } from "date-fns";

import { Person, Interactions } from "~/Data/NudgeInterfaces";
import { PersonProfileProps } from "~/Components/Company/OrgChart/OrgChart";

import { dateCompare } from "~/Util/sortUtils";
import { groupBy } from "~/Util/fp/array";
import { compose } from "~/Util/fp/function";
import { tryCatch } from "~/Util/fp/Instances/Option";
import { Compare } from "~/Util/fp/Instances/Compare";

import { MeetingIcon } from "~/Components/Icons/MeetingIcon";
import { InboundOutboundIcon, ioTypes } from "~/Components/Icons/InboundOutboundIcon";
import { mapEntries, propOr } from "~/Util/fp/object";
import { toUTCDate } from "~/Util/dateUtils";


interface TeamInteractionProps {
    interactions: Interactions;
    PersonProfile: React.FunctionComponent<PersonProfileProps>;
    person: Partial<Person>;
}
interface Interaction {
    type: string;
    date: string;
    displayDate?: string;
    teammate?: Partial<Person>;
    contact?: Partial<Person>;
};

const groupInteractions = (defaultUri: string) => compose(
    (interactions: [string, Interaction[]][]) => interactions
        .sort(Compare.of(dateCompare(false))
            .contramap<[string, Interaction[]]>(([_, is]) => tryCatch(() => is[0].date).getOrElse(() => "1900-01-01"))
            .run),
    mapEntries((uri: string, interactions: Interaction[]): [string, Interaction[]] =>
        [uri, interactions.map(i => ({ ...i, displayDate: isSameYear(new Date(), i.date) ? format(i.date, "MMM D") : format(i.date, "MMM D YYYY")}))]
    ),
    groupBy(({ teammate, contact }: Interaction) => (contact && contact.uri && `${contact.uri}_${teammate && teammate.uri}`) || (teammate && teammate.uri) || defaultUri),
);

export const TeamInteractions: React.FunctionComponent<TeamInteractionProps> = ({
    interactions,
    PersonProfile,
    person = {},
}) => {
    const {
        lastInboundTeamMember = {},
        lastInboundPerson = {},
        lastOutboundTeamMember = {},
        lastOutboundPerson = {},
        lastMeetingTeamMember = {},
        lastMeetingPerson = {},
        lastInbound: inbound = "",
        lastOutbound: outbound = "",
        lastMeeting: meeting = "",
    } = interactions;
    const [lastInbound, lastOutbound, lastMeeting] = [inbound, outbound, meeting].map(d => d === "" ? "" : toUTCDate(d));

    interface InteractionRecord {
        type: string;
        date: string;
        teammate: Partial<Person>;
        contact: Partial<Person>;
    }
    const sortedInteractions = groupInteractions(person.uri || "")(
        [
            ...(isSameDay(lastInbound, lastOutbound) && lastInboundTeamMember.uri === lastOutboundTeamMember.uri
                ? [{ type: "Conversation", date: lastInbound, teammate: lastInboundTeamMember.uri ? lastInboundTeamMember : person, contact: lastInboundPerson }]
                : [
                    { type: "Inbound", date: lastInbound, teammate: lastInboundTeamMember.uri ? lastInboundTeamMember : person, contact: lastInboundPerson },
                    { type: "Outbound", date: lastOutbound, teammate: lastOutboundTeamMember.uri ? lastOutboundTeamMember : person, contact: lastOutboundPerson },
                ]),
            { type: "Meeting", date: lastMeeting, teammate: lastMeetingTeamMember, contact: lastMeetingPerson },
        ]
            .filter(({ date }) => Boolean(date))
            .filter(({ teammate, contact }) => !(teammate && contact && (teammate.uri && contact.uri) && (teammate.uri == contact.uri)))
            .sort(Compare.of(dateCompare(false))
                .contramap(propOr("date", ""))
                .run)
    );
    const isTeam = lastInboundTeamMember.uri || lastOutboundTeamMember.uri || lastMeetingTeamMember.uri;

    return (
        (lastInbound || lastOutbound || lastMeeting) ? (
            <section className="f6">
                <h1 className="mv1 f5 fw5">{isTeam ? "Team " : ""}Interactions</h1>
                <table className="collapse center truncate" cellSpacing="0">
                    <tbody className="lh-copy truncate">
                        {sortedInteractions.map(([uri, interactions]: [string, Interaction[]]) => {
                            const [{ teammate, contact }] = interactions;
                            return (
                                <tr key={uri}>
                                    <td className="pr2">{contact && contact.uri && <PersonProfile
                                        size={30}
                                        className="mw5"
                                        name={contact.name || ""}
                                        title={contact.title || ""}
                                        imageUrl={contact.imageUrl || ""}
                                    />
                                    }</td>
                                    <td className="pr2">{interactions.map(({ type, date, displayDate }) =>
                                        <React.Fragment key={`${type}_${date}`}>
                                            {type === "Meeting" && <div className="flex items-center">
                                                <span className="f7 nowrap w3 pr2">{displayDate}</span>
                                                <div className="flex justify-center mv1" title="meeting" style={{ width: 41 }}>
                                                    <MeetingIcon fill="#1a9bfc" style={{ width: "15px", height: "15px" }} />
                                                </div>
                                            </div>}
                                            {type === "Conversation" && <div className="flex items-center">
                                                <span className="f7 nowrap w3 pr2">{displayDate}</span>
                                                <InboundOutboundIcon type={ioTypes.conversation as any} className="flex items-center" />
                                            </div>}
                                            {type === "Inbound" && <div className="flex items-center">
                                                <span className="f7 nowrap w3 pr2">{displayDate}</span>
                                                <InboundOutboundIcon type={ioTypes.inboundFlipped as any} className="flex items-center" />
                                            </div>}
                                            {type === "Outbound" && <div className="flex items-center">
                                                <span className="f7 nowrap w3 pr2">{displayDate}</span>
                                                <InboundOutboundIcon type={ioTypes.outboundFlipped as any} className="flex items-center" />
                                            </div>}
                                        </React.Fragment>
                                    )}</td>
                                    <td>{teammate && teammate.uri && teammate.uri !== person.uri && <PersonProfile
                                        size={30}
                                        className="mw5"
                                        name={teammate.name || ""}
                                        title={teammate.title || ""}
                                        imageUrl={teammate.imageUrl || ""}
                                    />
                                    }</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </section>
        ) : null
    );
};