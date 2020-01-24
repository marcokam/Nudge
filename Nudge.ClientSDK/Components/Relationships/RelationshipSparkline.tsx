import React from "react";  // eslint-disable-line @typescript-eslint/no-unused-vars

interface RelationshipValues {
    total: number;
    veryStrong: number;
    medium: number;
    weak: number;
    veryWeak: number;
    none: number;
    strongConnections: number;
    activeConnections: number;
}
interface RelationshipSparklineOptions {
    height: number;
    width: number;
    title: string;
    className: string;
    transitionInMs: number;
    data: RelationshipValues;
}

const classNameMap = {
    veryStrong: "bg-dark-green",
    strong: "bg-green",
    medium: "bg-light-green",
    weak: "bg-washed-green",
    veryWeak: "bg-near-white",
    none: "bg-white",
    strongConnections: "bg-dark-green",
    activeConnections: "bg-near-white",
};

export const RelationshipSparkline: React.FunctionComponent<RelationshipSparklineOptions> = ({ height, width, transitionInMs = 300, className = "", title, data }) => {
    const { total, ...relationshipValues } = data;
    const relationshipEntries = Object.entries(relationshipValues);

    return (
        <div className={`flex items-end ${className}`} style={{ width, height }} title={title}>
            {relationshipEntries.map(([key, val]) => {
                return (
                    <div
                        key={key}
                        className={(classNameMap as any)[key]}
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
