/// <reference types="react" />
interface IOTypes {
    inbound: "inbound";
    inboundFlipped: "inboundFlipped";
    outbound: "outbound";
    outboundFlipped: "outboundFlipped";
    conversation: "conversation";
}
export declare const ioTypes: {
    inbound: string;
    inboundFlipped: string;
    outbound: string;
    outboundFlipped: string;
    conversation: string;
};
export declare const ioColours: {
    [x: string]: string;
};
export declare function InboundOutboundIcon({ type, style, className, ...containerProps }: {
    type: keyof IOTypes;
    style?: object;
    className?: string;
}): JSX.Element;
export {};
