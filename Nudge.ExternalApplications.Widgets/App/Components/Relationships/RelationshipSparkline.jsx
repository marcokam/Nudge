import React from "react";

const classNameMap = {
    veryStrong: "bg-dark-green",
    strong: "bg-green",
    medium: "bg-light-green",
    weak: "bg-washed-green",
    veryWeak: "bg-near-white",
    none: "bg-white"
};

export default function RelationshipSparkline({ height, width, transitionInMs = 300, className = "", title, data }) {
    const { total, ...relationshipValues } = data;
    const relationshipEntries = Object.entries(relationshipValues);

    return (
        <div className={`flex items-end ${className}`} style={{ width, height }} title={title}>
            {relationshipEntries.map(([key, val]) => {
                return (
                    <div
                        key={key}
                        className={classNameMap[key]}
                        style={{
                            height,
                            width: total ? (val / total) * width : 0,
                            transition: `width ${transitionInMs}ms`,
                            transitionTimingFunction: "ease-in-out",
                        }}
                    />
                );
            })}
        </div>
    );
}
