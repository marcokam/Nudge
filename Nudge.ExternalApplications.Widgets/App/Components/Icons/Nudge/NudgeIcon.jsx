import React from "react";

export default function NudgeIcon({ fillCircle = "#139bff", fillPath = "#fff", ...containerProps }) {
    return (
        <svg viewBox="0 0 500 500" {...containerProps}>
            <circle
                style={{ fill: fillCircle }}
                cx="250"
                cy="250"
                r="250"
                transform="translate(-103.55 250) rotate(-45)"
            />
            <path
                style={{ fill: fillPath }}
                d="M384.9,193.17c-6.7-53.73-44.35-93.49-107.77-102.3C200.87,80.2,143.27,127.11,133.34,198.44l-22.68,162.3,71.89,10,22.87-163.94c4.44-31.55,30.35-50.16,61.93-45.77,47.36,6.62,47.56,44.94,45.36,60.73L289.86,385.74l71.87,10,15.21-108.82S388.57,211.58,384.9,193.17Z"
                transform="translate(0)"
            />
        </svg>
    );
}
