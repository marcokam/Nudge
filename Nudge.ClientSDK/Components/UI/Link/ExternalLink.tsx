import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars

interface ExternalLinkProps {
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    title: string;
    href: string;
    className?: string;
}
export const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ children, onClick, ...restProps}) => {
    return (
        <a
            target="_blank"
            onClick={onClick} 
            rel="noopener noreferrer external" 
            {...restProps}>
            {children}
        </a>
    );
}
