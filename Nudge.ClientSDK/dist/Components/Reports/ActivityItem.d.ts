import React, { ReactNode } from "react";
interface ActivityItemProps {
    activity: number;
    message?: ReactNode;
    directionSymbolOverrideFn?: (n: number) => "▲" | "▼" | "";
    plusMinusOverrideFn?: (n: number) => "+ " | "− " | "";
    colourClassOverrideFn?: (n: number) => "green" | "red" | "";
    fontClassname?: string;
}
declare const ActivityItem: React.FunctionComponent<ActivityItemProps>;
export default ActivityItem;
