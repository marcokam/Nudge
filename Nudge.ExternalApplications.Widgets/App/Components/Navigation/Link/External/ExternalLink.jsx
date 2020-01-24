import React from "react";

export default function ExternalLink({children, onClick, ...restProps}) {
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
