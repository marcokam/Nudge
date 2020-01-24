var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import React, { Component } from "react";
import { getDay, getMonth, endOfMonth, differenceInCalendarDays, isFirstDayOfMonth } from "date-fns";
import { range, filterUndef } from "../../../Util/fp/array";
var CalendarHeatmap = /** @class */ (function (_super) {
    __extends(CalendarHeatmap, _super);
    function CalendarHeatmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderWeekdayLabels = function () {
            var _a = _this.props, weekdayNames = _a.weekdayNames, boxSize = _a.boxSize, gutterSize = _a.gutterSize, padding = _a.padding, fontSize = _a.fontSize;
            var transform = "translate(" + (padding + fontSize * 1.5) + ", 0)";
            return (React.createElement("g", { style: { fontSize: fontSize }, transform: transform }, weekdayNames.map(function (name, index) {
                return name ? (React.createElement("text", { key: "weekdayLabel_" + index, x: index * (boxSize + gutterSize) + boxSize / 2, y: 1 * boxSize, textAnchor: "middle" }, name)) : null;
            })));
        };
        _this.renderMonthLabels = function (weeks, firstOfMonthWeeks) {
            var _a = _this.props, monthNames = _a.monthNames, boxSize = _a.boxSize, gutterSize = _a.gutterSize, padding = _a.padding, fontSize = _a.fontSize;
            var weekIndexesForLabels = filterUndef(firstOfMonthWeeks
                .map(function (_a, index) {
                var isFirstOfMonth = _a.isFirstOfMonth, date = _a.date;
                return isFirstOfMonth ? { label: monthNames[getMonth(date)], index: index } : undefined;
            }));
            var transform = "translate(0, " + (padding * 2 + fontSize / 2) + ")";
            return (React.createElement("g", { style: { fontSize: fontSize }, transform: transform }, weekIndexesForLabels.map(function (_a) {
                var _b = _a === void 0 ? { label: "Jan", index: 0 } : _a, label = _b.label, index = _b.index;
                return (React.createElement("text", { key: index, x: 0, y: (index + 1) * (boxSize + gutterSize) - gutterSize * 2 }, label));
            })));
        };
        _this.renderCalendar = function (weeks) {
            var _a = _this.props, boxSize = _a.boxSize, gutterSize = _a.gutterSize, padding = _a.padding, fontSize = _a.fontSize, values = _a.values, transformDayElement = _a.transformDayElement, classForValue = _a.classForValue, onMouseOver = _a.onMouseOver, onMouseLeave = _a.onMouseLeave;
            var mainTransform = "translate(" + (padding + fontSize * 1.5) + ", " + (boxSize + padding) + ")";
            var firstWeekShift = weeks.length > 0 && weeks[0].length > 0 && weeks[0][0] || 0;
            return (React.createElement("g", { transform: mainTransform }, weeks.map(function (week, weekIndex) {
                var weekTransform = "translate(0, " + weekIndex * (boxSize + gutterSize) + ")";
                return (React.createElement("g", { key: "week_" + weekIndex, transform: weekTransform }, week.map(function (day, dayIndex) {
                    var index = weekIndex * 7 + day - firstWeekShift;
                    var vIndex = values.length - 1 - index;
                    var value = values[vIndex];
                    var className = classForValue(value);
                    var element = (React.createElement("rect", { key: "day_" + dayIndex, className: className, width: boxSize, height: boxSize, x: day * (boxSize + gutterSize), y: 0, onMouseOver: function (event) { return onMouseOver(event, value); }, onMouseLeave: function (event) { return onMouseLeave(event, value); } }));
                    return transformDayElement(element, value, index);
                })));
            })));
        };
        _this.getStartEndDates = function () {
            var values = _this.props.values;
            var startDate, endDate;
            if (values.length > 0) {
                startDate = values[values.length - 1].date;
                endDate = values[0].date;
            }
            else {
                startDate = new Date();
                endDate = endOfMonth(startDate);
            }
            return { startDate: startDate, endDate: endDate };
        };
        _this.getWeeks = function () {
            var values = _this.props.values;
            var reversedValues = __spread(values).reverse();
            var firstOfMonth = reversedValues.map(function (v) { return isFirstDayOfMonth(v.date); });
            var _a = _this.getStartEndDates(), startDate = _a.startDate, endDate = _a.endDate;
            var startDay = getDay(startDate);
            var daysToShow = differenceInCalendarDays(endDate, startDate) + 1;
            var days = range(startDay, daysToShow + startDay).map(function (d) { return d % 7; });
            var firstOfMonthWeeks = [];
            var weeks = days.reduce(function (acc, d, i) {
                var lastWeek = acc[acc.length - 1];
                if (!lastWeek || lastWeek.length === 7 || d === 0) {
                    lastWeek = [];
                    acc.push(lastWeek);
                    firstOfMonthWeeks.push({ isFirstOfMonth: firstOfMonth[i], date: reversedValues[i].date });
                }
                lastWeek.push(d);
                var lastMonthWeeks = firstOfMonthWeeks[firstOfMonthWeeks.length - 1];
                if (!lastMonthWeeks.isFirstOfMonth && firstOfMonth[i]) {
                    lastMonthWeeks.isFirstOfMonth = true;
                    lastMonthWeeks.date = reversedValues[i].date;
                }
                return acc;
            }, []);
            // Show first month label if first label falls on 3rd row or after
            var minFirstOfMonthIndex = firstOfMonthWeeks.reduce(function (acc, fom, fomIndex) { return fom.isFirstOfMonth ? fomIndex : acc; }, Infinity);
            if (minFirstOfMonthIndex >= 2 && firstOfMonthWeeks[0]) {
                firstOfMonthWeeks[0].isFirstOfMonth = true;
            }
            // Don't show last label if first of month falls on last line
            if (firstOfMonthWeeks[firstOfMonthWeeks.length - 1]) {
                firstOfMonthWeeks[firstOfMonthWeeks.length - 1].isFirstOfMonth = false;
            }
            return { weeks: weeks, firstOfMonthWeeks: firstOfMonthWeeks };
        };
        return _this;
    }
    CalendarHeatmap.prototype.render = function () {
        var _a = this.props, boxSize = _a.boxSize, gutterSize = _a.gutterSize, padding = _a.padding, fontSize = _a.fontSize;
        var _b = this.getWeeks(), weeks = _b.weeks, firstOfMonthWeeks = _b.firstOfMonthWeeks;
        var width = 7 * (boxSize + gutterSize) + padding * 2 + fontSize * 1.5;
        var height = weeks.length * (boxSize + gutterSize) + padding * 3 + fontSize;
        return (React.createElement("svg", { className: "react-calendar-heatmap w-90", viewBox: "0 0 " + width + " " + height },
            this.renderWeekdayLabels(),
            this.renderMonthLabels(weeks, firstOfMonthWeeks),
            this.renderCalendar(weeks)));
    };
    CalendarHeatmap.defaultProps = {
        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        weekdayNames: ["", "M", "T", "W", "T", "F", ""],
        boxSize: 10,
        gutterSize: 1,
        fontSize: 6,
        padding: 5,
        values: [],
        showWeekdayLabels: true,
        classForValue: function () { return ""; },
        onMouseOver: function () { },
        onMouseLeave: function () { },
        transformDayElement: function (el) { return el; },
    };
    return CalendarHeatmap;
}(Component));
export default CalendarHeatmap;
//# sourceMappingURL=CalendarHeatmap.js.map