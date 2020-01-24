import React from "react";
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
export declare const RelationshipSparkline: React.FunctionComponent<RelationshipSparklineOptions>;
export {};
