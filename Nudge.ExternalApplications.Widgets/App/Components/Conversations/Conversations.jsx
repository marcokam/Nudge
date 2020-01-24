import React, { Fragment } from "react";
import { format, isSameDay, getMonth } from "date-fns";
import { conversationDisplayTypes } from "@nudge/client-sdk/Data/Team/Conversation/conversationData";
import { InboundOutboundIcon, ioTypes } from "@nudge/client-sdk/Components/Icons/InboundOutboundIcon";
import { MeetingIcon } from "@nudge/client-sdk/Components/Icons/MeetingIcon";
import CalendarHeatmap from "@nudge/client-sdk/Components/Calendar/Heatmap/CalendarHeatmap";

import PersonProfile from "~/App/Components/Profile/Person/PersonProfile.jsx";

import "./Conversations.scss";

function Conversations({
    today = new Date(),
    conversationDays = 60,
    conversationsBy = conversationDisplayTypes.user,
    conversations = [],
    heatmapValues = [],
    inboundOutboundByUser = {},
    inboundOutboundByContact = {},
    heatmapOnMouseOver,
    heatmapOnMouseLeave,
    onLock,
}) {
    return (
        <Fragment>
            <div className="fixed tc" style={{ width: 200 }}>
                <CalendarHeatmap
                    values={heatmapValues}
                    showWeekdayLabels={true}
                    classForValue={value => {
                        const convClass =
                            value.conversations.length === 1
                                ? "one-conversation"
                                : value.conversations.length > 1
                                    ? "more-conversations"
                                    : "";
                        const todayClass = isSameDay(value.date, today) ? "today" : "";
                        return [convClass, todayClass].join(" ").trim();
                    }}
                    horizontal={false}
                    onMouseOver={heatmapOnMouseOver}
                    onMouseLeave={heatmapOnMouseLeave}
                    transformDayElement={(element, value, index) => {
                        const { x, y } = element.props;
                        const fontSize = 5;
                        const textX = x + fontSize;
                        const textY = y + fontSize * 1.3;
                        const month = getMonth(value.date) + 1;
                        const isEven = month % 2 === 0;
                        return (
                            <g key={`day_${index}`}>
                                {value.conversations.length > 0 && (
                                    <text textAnchor="middle" x={textX} y={textY} style={{ fontSize }}>
                                        {value.date.getDate()}
                                    </text>
                                )}
                                <rect {...element.props} className={[element.props.className, isEven ? "evenMonth" : ""].filter(i => i).join(" ")} />
                            </g>
                        );
                    }}
                />
            </div>
            <div style={{ marginLeft: 200, width: "calc(100% - 200px)" }}>
                <div>
                    {conversations.length ? conversations.map(
                        ({
                            date: conversationDate = "",
                            sortedConversationsByUser = {},
                            sortedConversationsByContact = {},
                        }) => {
                            const byUser = conversationsBy === conversationDisplayTypes.user;
                            const sortedConversationsList = Object.entries(
                                byUser ? sortedConversationsByUser : sortedConversationsByContact,
                            );
                            return (
                                <Fragment key={conversationDate}>
                                    <h3 className="mv0 f6 pa2 bg-light-gray">{format(conversationDate, "MMM D")}</h3>
                                    {!sortedConversationsList.length && <p className="mv0 f6">No activity</p>}
                                    {sortedConversationsList.map(([_, interactionList = []]) => {
                                        const [firstInteraction = {}] = Object.values(interactionList);
                                        const { user = {}, contact = {} } = firstInteraction;
                                        return byUser ? (
                                            <ConversationsByUser
                                                key={user.uri}
                                                user={user}
                                                onLock={onLock}
                                                interactionList={interactionList}
                                                inboundOutboundMap={inboundOutboundByUser}
                                            />
                                        ) : (
                                            <ConversationsByContact
                                                key={contact.uri}
                                                contact={contact}
                                                onLock={onLock}
                                                interactionList={interactionList}
                                                inboundOutboundMap={inboundOutboundByContact}
                                            />
                                        );
                                    })}
                                </Fragment>
                            );
                        },
                    ) : <p className="mv0 f6">No activity in the last {conversationDays} days</p>}
                </div>
            </div>
        </Fragment>
    );
}

const WrappedConversations = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <Conversations {...props} />
    </div>
));
WrappedConversations.displayName = "Conversations";
export default WrappedConversations;


const getIoType = io => io
    ? io.response && io.outreachCount && isSameDay(io.lastInbound, io.lastOutbound)
        ? ioTypes.conversation
        : io.response
            ? ioTypes.inbound
            : io.outreachCount
                ? ioTypes.outbound
                : ""
    : "";

function ConversationsByUser({ user, onLock, interactionList, inboundOutboundMap }) {
    const { uri: userUri = "", name = "", jobTitle = "", imageUrl = "" } = user;
    return (
        <div className={"flex bb b--black-05 f6"} key={userUri}>
            <div className="w-34">
                <PersonProfile
                    uri={userUri}
                    name={name}
                    title={jobTitle}
                    imageUrl={imageUrl}
                    className="mv2"
                    onClick={onLock({
                        uri: userUri,
                        type: "user",
                        name,
                        title: jobTitle,
                        imageUrl,
                    })}
                />
            </div>
            <div className="ml3 truncate">
                {interactionList.map(({ contact = {} }) => {
                    const { uri: personUri = "", name = "", title = "", imageUrl = "" } = contact;
                    const io = inboundOutboundMap[userUri] && inboundOutboundMap[userUri][personUri];
                    const ioType = getIoType(io);
                    return (
                        <div key={personUri} className="flex truncate">
                            <div className="flex flex-column items-center justify-center ph3 w3">
                                {ioType && <InboundOutboundIcon type={ioType} className="flex items-center" />}
                                <div className="flex" title="meeting">
                                    {io.meeting && (
                                        <MeetingIcon fill="#1a9bfc" style={{ width: "15px", height: "15px" }} />
                                    )}
                                </div>
                            </div>
                            <PersonProfile
                                uri={personUri}
                                name={name}
                                title={title}
                                imageUrl={imageUrl}
                                className="truncate mv2"
                                onClick={onLock({
                                    uri: personUri,
                                    type: "person",
                                    name,
                                    title,
                                    imageUrl,
                                })}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ConversationsByContact({ contact, onLock, interactionList, inboundOutboundMap }) {
    const { uri: personUri = "", name = "", title = "", imageUrl = "" } = contact;
    return (
        <div className={"flex bb b--black-05 f6"} key={personUri}>
            <div className="w-50">
                {interactionList.map(({ user = {} }) => {
                    const { uri: userUri = "", name = "", jobTitle = "", imageUrl = "" } = user;
                    const io = inboundOutboundMap[personUri] && inboundOutboundMap[personUri][userUri];
                    const ioType = getIoType(io);
                    return (
                        <div key={userUri} className="flex truncate">
                            <PersonProfile
                                uri={userUri}
                                className="w-100 truncate mv2"
                                name={name}
                                title={jobTitle}
                                imageUrl={imageUrl}
                                onClick={onLock({
                                    uri: userUri,
                                    type: "user",
                                    name,
                                    title: jobTitle,
                                    imageUrl,
                                })}
                            />
                            <div className="flex flex-column items-center justify-center ph3 w3">
                                {ioType && <InboundOutboundIcon type={ioType} className="flex items-center" />}
                                <div className="flex" title="meeting">
                                    {io.meeting && (
                                        <MeetingIcon fill="#1a9bfc" style={{ width: "15px", height: "15px" }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="ml3 truncate">
                <PersonProfile
                    uri={personUri}
                    name={name}
                    title={title}
                    imageUrl={imageUrl}
                    className="truncate mv2"
                    onClick={onLock({
                        uri: personUri,
                        type: "person",
                        name,
                        title,
                        imageUrl,
                    })}
                />
            </div>
        </div>
    );
}
