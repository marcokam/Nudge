var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _a;
import { option } from "../../../Util/fp/Instances/Option";
import { generateOrdering, numCompareByDir } from "../../../Util/sortUtils";
import { Compare } from "../../../Util/fp/Instances/Compare";
export var JobLevel;
(function (JobLevel) {
    JobLevel["c_level"] = "c_level";
    JobLevel["senior_vicepresident"] = "senior_vicepresident";
    JobLevel["vicepresident"] = "vicepresident";
    JobLevel["senior_director"] = "senior_director";
    JobLevel["director"] = "director";
    JobLevel["senior_manager"] = "senior_manager";
    JobLevel["manager"] = "manager";
    JobLevel["individual"] = "individual";
    JobLevel["unknown"] = "unknown";
})(JobLevel || (JobLevel = {}));
export var JobLevelDisplay;
(function (JobLevelDisplay) {
    JobLevelDisplay["C-Level"] = "C-Level";
    JobLevelDisplay["VP"] = "VP";
    JobLevelDisplay["Director"] = "Director";
    JobLevelDisplay["Manager"] = "Manager";
    JobLevelDisplay["Individual"] = "Individual";
    JobLevelDisplay["Unknown"] = "Unknown";
})(JobLevelDisplay || (JobLevelDisplay = {}));
var typeToDisplayType = Object.freeze((_a = {},
    _a[JobLevel.c_level] = JobLevelDisplay["C-Level"],
    _a[JobLevel.senior_vicepresident] = JobLevelDisplay.VP,
    _a[JobLevel.vicepresident] = JobLevelDisplay.VP,
    _a[JobLevel.senior_director] = JobLevelDisplay.Director,
    _a[JobLevel.director] = JobLevelDisplay.Director,
    _a[JobLevel.senior_manager] = JobLevelDisplay.Manager,
    _a[JobLevel.manager] = JobLevelDisplay.Manager,
    _a[JobLevel.individual] = JobLevelDisplay.Individual,
    _a[JobLevel.unknown] = JobLevelDisplay.Unknown,
    _a));
export var jobLevelTypeToDisplay = function (jobLevel) { return option.of(typeToDisplayType[jobLevel]).getOrElse(function () { return JobLevelDisplay.Unknown; }); };
var _b = generateOrdering(JobLevel), levelToOrdering = _b.typeToOrdering, orderingToLevel = _b.orderingToType;
export var jobLevelToOrdering = function (jobLevel) { return levelToOrdering(jobLevel).getOrElse(function () { return 0; }); };
export var jobLevelOrderingToJobLevel = function (ordering) {
    if (ordering === void 0) { ordering = 0; }
    return orderingToLevel(ordering).getOrElse(function () { return JobLevel.unknown; });
};
var _c = generateOrdering(JobLevelDisplay), displayToOrdering = _c.typeToOrdering, orderingToDisplay = _c.orderingToType;
export var jobLevelDisplayToOrdering = function (jobLevelDisplay) { return displayToOrdering(jobLevelDisplay).getOrElse(function () { return 0; }); };
export var jobLevelDisplayOrderingToJobLevelDisplay = function (ordering) {
    if (ordering === void 0) { ordering = 0; }
    return orderingToDisplay(ordering).getOrElse(function () { return JobLevelDisplay.Unknown; });
};
export var levelIsEqual = function (level, display) { return jobLevelTypeToDisplay(level) === display; };
export var levelsToDisplay = function (levels) {
    if (levels.length === 0) {
        return levels;
    }
    // reduce on display keys to keep order
    return Array.from(Object.keys(JobLevelDisplay).reduce(function (acc, k) {
        levels.filter(function (_a) {
            var _b = __read(_a, 1), l = _b[0];
            return levelIsEqual(l, k);
        })
            .forEach(function (_a) {
            var _b = __read(_a, 2), _ = _b[0], set = _b[1];
            var prevLevel = acc.get(k);
            var count = prevLevel ? prevLevel[1] + set.size : set.size;
            acc.set(k, [k, count]);
        });
        return acc;
    }, new Map()));
};
export var byLevelDisplay = Compare.of(numCompareByDir(true)).contramap(jobLevelDisplayToOrdering);
//# sourceMappingURL=jobLevelData.js.map