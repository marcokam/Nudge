import {
    format,
    differenceInMinutes,
    differenceInHours,
    differenceInCalendarYears,
} from "date-fns";

export function formatDate(date, formatStr = "YYYY-MM-DDTHH:mm:ss.SSS") {
    return format(date, formatStr, { awareOfUnicodeTokens: true });
}

export function toUTCDate(dateString = new Date().toISOString()) {
    const lastCharacter = dateString.slice(dateString.length - 1);
    if (lastCharacter === "Z") {
        return dateString;
    }
    return `${dateString}Z`;
}

export function getUTCDate(dateString = Date.now()) {
    const date = new Date(dateString);
  
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
    );
}

/**
 * Formats the difference between 2 days in m/h or exact date (similar to twitter mobile)
 * @param {date}    laterDate       later date for comparison
 * @param {date}    earlierDate     earlier date for comparison
 * @return {string}                 formatted string representing difference
 */
export function formatDateDifference(laterDate, earlierDate) {
    let diff = 0;

    diff = differenceInMinutes(laterDate, earlierDate);
    if (diff < 60) {
        return `${diff}m`;
    }

    diff = differenceInHours(laterDate, earlierDate);
    if (diff < 24) {
        return `${diff}h`;
    }

    diff = differenceInCalendarYears(laterDate, earlierDate);
    if (diff >= 1) {
        return `${diff}y`;
    }

    return formatDate(earlierDate, "MMM D");
}
