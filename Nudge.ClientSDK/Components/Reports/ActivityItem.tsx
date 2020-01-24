import React, { ReactNode } from "react";  // eslint-disable-line @typescript-eslint/no-unused-vars

interface ActivityItemProps {
    activity: number;
    message?: ReactNode;
    directionSymbolOverrideFn?: (n: number) => "▲" | "▼" | "";
    plusMinusOverrideFn?: (n: number) => "+ " | "− " | "";
    colourClassOverrideFn?: (n: number) => "green" | "red" | "";
    fontClassname?: string;
}


const activityDirectionSymbol = (a: number) => (a >= 0 ? "▲" : a < 0 ? "▼" : "");
const activityPlusMinus = (a: number) => (a >= 0 ? "+ " : a < 0 ? "− " : "");
const activityColourClass = (a: number) => (a >= 0 ? "green" : a < 0 ? "red" : "");

const ActivityItem: React.FunctionComponent<ActivityItemProps> = ({
    activity = 0,
    message = undefined,
    directionSymbolOverrideFn = activityDirectionSymbol,
    plusMinusOverrideFn = activityPlusMinus,
    colourClassOverrideFn = activityColourClass,
    fontClassname = "f6"
}) => (
    <div className="dt-row">
        <span className={`dtc nowrap pr2 fw6 ${fontClassname} ${colourClassOverrideFn(activity)}`}>
            {directionSymbolOverrideFn(activity)} {plusMinusOverrideFn(activity)}
            {Math.abs(activity)}
        </span>
        <span className={`dtc ${fontClassname}`}>{message}</span>
    </div>
);


export default ActivityItem;
