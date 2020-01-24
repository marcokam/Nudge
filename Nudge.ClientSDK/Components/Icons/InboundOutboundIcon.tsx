import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { EmailIcon } from "~/Components/Icons/Social/EmailIcon";

interface IOTypes {
    inbound: "inbound";
    inboundFlipped: "inboundFlipped";
    outbound: "outbound";
    outboundFlipped: "outboundFlipped";
    conversation: "conversation";
};

export const ioTypes = {
    inbound: "inbound",
    inboundFlipped: "inboundFlipped",
    outbound: "outbound",
    outboundFlipped: "outboundFlipped",
    conversation: "conversation",
};
const ioTitle = {
    [ioTypes.inbound]: "inbound",
    [ioTypes.inboundFlipped]: "inbound",
    [ioTypes.outbound]: "outbound",
    [ioTypes.outboundFlipped]: "outbound",
    [ioTypes.conversation]: "conversation",
};
export const ioColours = {
    [ioTypes.inbound]: "#666",
    [ioTypes.inboundFlipped]: "#666",
    [ioTypes.outbound]: "#1a9bfc",
    [ioTypes.outboundFlipped]: "#1a9bfc",
    [ioTypes.conversation]: "#80c98a",
};

export function InboundOutboundIcon({ type, style, className = "", ...containerProps }: { type: keyof IOTypes; style?: object; className?: string }) {
    const color = ioColours[type];
    return (
        <div style={{ ...style, color }} className={className} title={ioTitle[type]} {...containerProps}>
            <span style={{ width: "13px" }}>{[ioTypes.conversation, ioTypes.inbound, ioTypes.outboundFlipped].includes(type) && "←"}</span>
            <EmailIcon fill={color} style={{ width: "15px" }} />
            <span style={{ width: "13px" }}>{[ioTypes.conversation, ioTypes.outbound, ioTypes.inboundFlipped].includes(type) && "→"}</span>
        </div>
    );
}