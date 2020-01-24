import { Compare } from "../../../Util/fp/Instances/Compare";
export declare enum JobLevel {
    "c_level" = "c_level",
    "senior_vicepresident" = "senior_vicepresident",
    "vicepresident" = "vicepresident",
    "senior_director" = "senior_director",
    "director" = "director",
    "senior_manager" = "senior_manager",
    "manager" = "manager",
    "individual" = "individual",
    "unknown" = "unknown"
}
export declare enum JobLevelDisplay {
    "C-Level" = "C-Level",
    "VP" = "VP",
    "Director" = "Director",
    "Manager" = "Manager",
    "Individual" = "Individual",
    "Unknown" = "Unknown"
}
export declare const jobLevelTypeToDisplay: (jobLevel: JobLevel) => JobLevelDisplay;
export declare const jobLevelToOrdering: (jobLevel: JobLevel) => number;
export declare const jobLevelOrderingToJobLevel: (ordering?: number) => "unknown" | JobLevel | "c_level" | "senior_vicepresident" | "vicepresident" | "senior_director" | "director" | "senior_manager" | "manager" | "individual";
export declare const jobLevelDisplayToOrdering: (jobLevelDisplay: JobLevelDisplay) => number;
export declare const jobLevelDisplayOrderingToJobLevelDisplay: (ordering?: number) => JobLevelDisplay | "C-Level" | "VP" | "Director" | "Manager" | "Individual" | "Unknown";
export declare const levelIsEqual: (level: JobLevel, display: JobLevelDisplay) => boolean;
export declare const levelsToDisplay: (levels: [JobLevel, Set<string>][]) => [any, any][];
export declare const byLevelDisplay: Compare<JobLevelDisplay>;
