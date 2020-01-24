import { option } from "~/Util/fp/Instances/Option";
import { generateOrdering, numCompareByDir } from "~/Util/sortUtils";
import { Compare } from "~/Util/fp/Instances/Compare";

export enum JobLevel {
    "c_level" = "c_level",
    "senior_vicepresident" = "senior_vicepresident",
    "vicepresident" = "vicepresident",
    "senior_director" = "senior_director",
    "director" = "director",
    "senior_manager" = "senior_manager",
    "manager" = "manager",
    "individual" = "individual",
    "unknown" = "unknown",
}
export enum JobLevelDisplay {
    "C-Level" = "C-Level",
    "VP" = "VP",
    "Director" = "Director",
    "Manager" = "Manager",
    "Individual" = "Individual",
    "Unknown" = "Unknown",
}

const typeToDisplayType: Record<JobLevel, JobLevelDisplay> = Object.freeze({
    [JobLevel.c_level]: JobLevelDisplay["C-Level"],
    [JobLevel.senior_vicepresident]: JobLevelDisplay.VP,
    [JobLevel.vicepresident]: JobLevelDisplay.VP,
    [JobLevel.senior_director]: JobLevelDisplay.Director,
    [JobLevel.director]: JobLevelDisplay.Director,
    [JobLevel.senior_manager]: JobLevelDisplay.Manager,
    [JobLevel.manager]: JobLevelDisplay.Manager,
    [JobLevel.individual]: JobLevelDisplay.Individual,
    [JobLevel.unknown]: JobLevelDisplay.Unknown,
});
export const jobLevelTypeToDisplay = (jobLevel: JobLevel) => option.of(typeToDisplayType[jobLevel]).getOrElse(() => JobLevelDisplay.Unknown); 

const { typeToOrdering: levelToOrdering, orderingToType: orderingToLevel } = generateOrdering(JobLevel);
export const jobLevelToOrdering = (jobLevel: JobLevel) => levelToOrdering(jobLevel).getOrElse(() => 0);
export const jobLevelOrderingToJobLevel = (ordering = 0) => orderingToLevel(ordering).getOrElse(() => JobLevel.unknown)

const { typeToOrdering: displayToOrdering, orderingToType: orderingToDisplay } = generateOrdering(JobLevelDisplay);
export const jobLevelDisplayToOrdering = (jobLevelDisplay: JobLevelDisplay) => displayToOrdering(jobLevelDisplay).getOrElse(() => 0);
export const jobLevelDisplayOrderingToJobLevelDisplay = (ordering = 0) => orderingToDisplay(ordering).getOrElse(() => JobLevelDisplay.Unknown);

export const levelIsEqual = (level: JobLevel, display: JobLevelDisplay) => jobLevelTypeToDisplay(level) === display;
export const levelsToDisplay = (levels: [JobLevel, Set<string>][]) => {
    if (levels.length === 0) {
        return levels;
    }
    // reduce on display keys to keep order
    return Array.from(Object.keys(JobLevelDisplay).reduce((acc, k) => {
        levels.filter(([l]) => levelIsEqual(l, k as JobLevelDisplay))
            .forEach(([_, set]) => {
                const prevLevel = acc.get(k);
                const count = prevLevel ? prevLevel[1] + set.size : set.size;
                acc.set(k, [k, count]);
            });
        return acc;
    }, new Map()));
};
export const byLevelDisplay = Compare.of(numCompareByDir(true)).contramap(jobLevelDisplayToOrdering);
