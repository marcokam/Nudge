import React, { Component } from "react";
import { getDay, getMonth, endOfMonth, differenceInCalendarDays, isFirstDayOfMonth } from "date-fns";
import { range } from "lodash";

export default class CalendarHeatmap extends Component {
    static defaultProps = {
        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        weekdayNames: ["", "M", "T", "W", "T", "F", ""],
        boxSize: 10,
        gutterSize: 1,
        fontSize: 6,
        padding: 5,
        values: [],
        showWeekdayLabels: true,
        classForValue: () => "",
        onMouseOver: () => {},
        onMouseLeave: () => {},
        transformDayElement: i => i,
    };

    render() {
        const { boxSize, gutterSize, padding, fontSize } = this.props;
        const { weeks, firstOfMonthWeeks } = this.getWeeks();
        const width = 7 * (boxSize + gutterSize) + padding * 2 + fontSize * 1.5;
        const height = weeks.length * (boxSize + gutterSize) + padding * 3 + fontSize;
        return (
            <svg className="react-calendar-heatmap w-90" viewBox={`0 0 ${width} ${height}`}>
                {this.renderWeekdayLabels()}
                {this.renderMonthLabels(weeks, firstOfMonthWeeks)}
                {this.renderCalendar(weeks)}
            </svg>
        );
    }
    renderWeekdayLabels = () => {
        const { weekdayNames, boxSize, gutterSize, padding, fontSize } = this.props;
        const transform = `translate(${padding + fontSize * 1.5}, 0)`;
        return (
            <g style={{ fontSize }} transform={transform}>
                {weekdayNames.map((name, index) =>
                    name ? (
                        <text key={`weekdayLabel_${index}`} x={index * (boxSize + gutterSize) + boxSize / 2} y={1 * boxSize} textAnchor="middle">
                            {name}
                        </text>
                    ) : null,
                )}
            </g>
        );
    };
    renderMonthLabels = (weeks, firstOfMonthWeeks) => {
        const { monthNames, boxSize, gutterSize, padding, fontSize } = this.props;
        const weekIndexesForLabels = firstOfMonthWeeks.map(({ isFirstOfMonth, date }, index) => isFirstOfMonth ? { label: monthNames[getMonth(date)], index } : null).filter(i => i);
        const transform = `translate(0, ${padding * 2 + fontSize / 2})`;

        return (
            <g style={{ fontSize }} transform={transform}>
                {weekIndexesForLabels.map(({ label, index }) => (
                    <text key={index} x={0} y={(index + 1) * (boxSize + gutterSize) - gutterSize * 2}>{label}</text>    
                ))}
            </g>
        );
    };
    renderCalendar = weeks => {
        const {
            boxSize,
            gutterSize,
            padding,
            fontSize,
            values,
            transformDayElement,
            classForValue,
            onMouseOver,
            onMouseLeave,
        } = this.props;
        const mainTransform = `translate(${padding + fontSize * 1.5}, ${boxSize + padding})`;
        const firstWeekShift = weeks.length > 0 && weeks[0].length > 0 && weeks[0][0] || 0;

        return (
            <g transform={mainTransform}>
                {weeks.map((week, weekIndex) => {
                    const weekTransform = `translate(0, ${weekIndex * (boxSize + gutterSize)})`;
                    return (
                        <g key={`week_${weekIndex}`} transform={weekTransform}>
                            {week.map((day, dayIndex) => {
                                const index = weekIndex * 7 + day - firstWeekShift;
                                const vIndex = values.length - 1 - index;
                                const value = values[vIndex];
                                const className = classForValue(value);
                                const element = (
                                    <rect
                                        key={`day_${dayIndex}`}
                                        className={className}
                                        width={boxSize}
                                        height={boxSize}
                                        x={day * (boxSize + gutterSize)}
                                        y={0}
                                        onMouseOver={event => onMouseOver(event, value)}
                                        onMouseLeave={event => onMouseLeave(event, value)}
                                    />
                                );
                                return transformDayElement(element, value, index);
                            })}
                        </g>
                    );
                })}
            </g>
        );
    };

    getStartEndDates = () => {
        const { values } = this.props;
        let startDate, endDate;
        if (values.length > 0) {
            startDate = values[values.length - 1].date;
            endDate = values[0].date;
        } else {
            startDate = new Date();
            endDate = endOfMonth(startDate);
        }
        return { startDate, endDate };
    }
    getWeeks = () => {
        const { values } = this.props;
        const reversedValues = [...values].reverse();
        const firstOfMonth = reversedValues.map(v => isFirstDayOfMonth(v.date));
        const { startDate, endDate } = this.getStartEndDates();
        const startDay = getDay(startDate);
        const daysToShow = differenceInCalendarDays(endDate, startDate) + 1;
        const days = range(startDay, daysToShow + startDay).map(d => d % 7);
        const firstOfMonthWeeks = [];
        const weeks = days.reduce((acc, d, i) => {
            let lastWeek = acc[acc.length - 1];
            if (!lastWeek || lastWeek.length === 7 || d === 0) {
                lastWeek = [];
                acc.push(lastWeek);
                firstOfMonthWeeks.push({ isFirstOfMonth: firstOfMonth[i], date: reversedValues[i].date });
            }
            lastWeek.push(d);
            const lastMonthWeeks = firstOfMonthWeeks[firstOfMonthWeeks.length - 1];
            if (!lastMonthWeeks.isFirstOfMonth && firstOfMonth[i]) {
                lastMonthWeeks.isFirstOfMonth = true;
                lastMonthWeeks.date = reversedValues[i].date;
            }

            return acc;
        }, []);

        // Show first month label if first label falls on 3rd row or after
        const minFirstOfMonthIndex = firstOfMonthWeeks.reduce((acc, fom, fomIndex) => fom.isFirstOfMonth ? fomIndex : acc , Infinity);
        if (minFirstOfMonthIndex >= 2 && firstOfMonthWeeks[0]) {
            firstOfMonthWeeks[0].isFirstOfMonth = true;
        }

        // Don't show last label if first of month falls on last line
        if (firstOfMonthWeeks[firstOfMonthWeeks.length - 1]) {
            firstOfMonthWeeks[firstOfMonthWeeks.length - 1].isFirstOfMonth = false;
        }

        return { weeks, firstOfMonthWeeks };
    };
}
