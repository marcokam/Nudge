import React from "react";
interface TooltipProps {
    parent: Element | null;
    targetSelector: string;
    hide: () => void;
    className?: string;
    bounds?: Partial<ClientRect>;
}
export declare const Tooltip: React.FunctionComponent<TooltipProps>;
export {};
