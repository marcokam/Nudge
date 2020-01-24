import React, { Component } from "react";
interface HeatmapValue {
    date: Date;
}
interface FirstOfMonthWeek {
    isFirstOfMonth: boolean;
    date: Date;
}
declare type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
interface CalendarHeatmapProps {
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    weekdayNames: ["", "M", "T", "W", "T", "F", ""];
    boxSize: 10;
    gutterSize: 1;
    fontSize: 6;
    padding: 5;
    values: HeatmapValue[];
    showWeekdayLabels: true;
    classForValue: (h: HeatmapValue) => string;
    onMouseOver: (e: React.MouseEvent<SVGRectElement, MouseEvent>, h: HeatmapValue) => void;
    onMouseLeave: (e: React.MouseEvent<SVGRectElement, MouseEvent>, h: HeatmapValue) => void;
    transformDayElement: (el: JSX.Element, h: HeatmapValue, i: number) => JSX.Element;
}
export default class CalendarHeatmap extends Component<CalendarHeatmapProps> {
    static defaultProps: {
        monthNames: string[];
        weekdayNames: string[];
        boxSize: number;
        gutterSize: number;
        fontSize: number;
        padding: number;
        values: never[];
        showWeekdayLabels: boolean;
        classForValue: () => string;
        onMouseOver: () => void;
        onMouseLeave: () => void;
        transformDayElement: (el: JSX.Element) => JSX.Element;
    };
    render(): JSX.Element;
    renderWeekdayLabels: () => JSX.Element;
    renderMonthLabels: (weeks: WeekDay[][], firstOfMonthWeeks: FirstOfMonthWeek[]) => JSX.Element;
    renderCalendar: (weeks: WeekDay[][]) => JSX.Element;
    getStartEndDates: () => {
        startDate: Date;
        endDate: Date;
    };
    getWeeks: () => {
        weeks: WeekDay[][];
        firstOfMonthWeeks: FirstOfMonthWeek[];
    };
}
export {};
