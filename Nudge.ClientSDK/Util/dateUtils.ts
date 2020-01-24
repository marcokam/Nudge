import { tryCatch } from "./fp/Instances/Option";

const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const getMonthAbbreviation = (dateStr: string) =>
    tryCatch(() => new Date(dateStr))
        .map(d => d.getMonth())
        .map(month => monthAbbreviations[month])
        .getOrElse(() => "");

export function toUTCDate(dateString = new Date().toISOString()) {
    const lastCharacter = dateString.slice(dateString.length - 1);
    if (lastCharacter === "Z") {
        return dateString;
    }
    return `${dateString}Z`;
}