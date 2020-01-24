import React from "react";

export default function Loading({ title = "Loading Widget..." }) {
    return <div className="absolute absolute--fill flex items-center justify-center">{title}</div>;
}
