import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars

export function Chevron({ stroke = "#666" }) {
    return (
        <svg width="14" height="9" viewBox="0 0 14 9">
            <g fill="none" fillRule="evenodd" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M13.02 1.657L7.365 7.314M7.364 7.314L1.707 1.657"/>
            </g>
        </svg>
    );
}
