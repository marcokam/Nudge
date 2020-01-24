import { tryCatch } from "./fp/Instances/Option";
var monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export var getMonthAbbreviation = function (dateStr) {
    return tryCatch(function () { return new Date(dateStr); })
        .map(function (d) { return d.getMonth(); })
        .map(function (month) { return monthAbbreviations[month]; })
        .getOrElse(function () { return ""; });
};
export function toUTCDate(dateString) {
    if (dateString === void 0) { dateString = new Date().toISOString(); }
    var lastCharacter = dateString.slice(dateString.length - 1);
    if (lastCharacter === "Z") {
        return dateString;
    }
    return dateString + "Z";
}
//# sourceMappingURL=dateUtils.js.map