import React from "react";
interface ExternalLinkProps {
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    title: string;
    href: string;
    className?: string;
}
export declare const ExternalLink: React.FunctionComponent<ExternalLinkProps>;
export {};
