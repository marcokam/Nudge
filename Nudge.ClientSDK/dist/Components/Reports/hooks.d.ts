import { WeeklyActivity, Leaderboard, NetworkView, ContactActivity } from "../../Data/Report/ReportInterfaces";
export declare function useWeeklyActivityReport(userUri: string): (Partial<WeeklyActivity> & {
    apiState: string;
})[];
export declare function useLeaderboardReport(userUri: string): (Partial<Leaderboard> & {
    apiState: string;
})[];
export declare function useNetworkViewReport(userUri: string): (Partial<NetworkView> & {
    apiState: string;
})[];
export declare function useContactActivity(weeks?: number): ({
    apiState: string;
    newContacts: ContactActivity[];
    allContacts: ContactActivity[];
} | {
    generateCSVContent: () => string;
    exportContactActivity: () => void;
})[];
export declare function useRelationshipViewReport(userUri: string): (Partial<NetworkView> & {
    apiState: string;
})[];
