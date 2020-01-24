import React from "react";
import { IUser } from "../../../Data/NudgeInterfaces";
interface LeaderboardRowProps {
    rank: number;
    user: Partial<IUser>;
    highlightUserId: string;
    memberImageSize: number;
    generateLink?: (userId: number) => string;
}
export declare const LeaderboardRow: React.FunctionComponent<LeaderboardRowProps>;
export {};
