export declare type FlaggedDataReason = "" | "cancelled" | "general" | "incorrectCompany" | "incorrectTitle";
export declare const flaggedDataReason: {
    none: FlaggedDataReason;
    cancelled: FlaggedDataReason;
    general: FlaggedDataReason;
    incorrectCompany: FlaggedDataReason;
    incorrectTitle: FlaggedDataReason;
};
export declare const getPrefixAndReason: (note?: string) => {
    prefix: string;
    reason: FlaggedDataReason;
} | {
    prefix: string;
    reason: FlaggedDataReason;
};
export declare const getCurrentFlaggedData: () => import("../../../Util/fp/Instances/Task").Task<unknown, any>;
export declare const flagProfileWithPrefixAndReason: (prefix?: string, reason?: FlaggedDataReason) => (personUri: string) => import("../../../Util/fp/Instances/Task").Task<unknown, any>;
