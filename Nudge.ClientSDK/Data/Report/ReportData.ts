import { format } from "date-fns";
import { WeeklyActivityResult, StrengthChangeResult } from "./ReportInterfaces";

export function getWeeklyActivityChartOptions(weeklyActivity: Partial<WeeklyActivityResult> = {}) {
    const { dtaPnt = [] } = weeklyActivity;
    const labels = dtaPnt.map(p => p.TimeTick);
    const relationshipData = dtaPnt.map(p => p.RelationshipGrowth);
    const meetingsData = dtaPnt.map(p => p.Meetings);
    const outboundData = dtaPnt.map(p => p.OutboundEmail);
    const maxDataValue = relationshipData
        .concat(meetingsData)
        .concat(outboundData)
        .reduce((acc, v) => Math.max(acc, Math.abs(v)), 0);
    const axesDefault = {
        ticks: {
            fontSize: 10,
            fontFamily: "proxima-nova, system-ui, Arial, Helvetica, sans-serif",
            padding: 5,
            maxRotation: 0,
        },
    };
    const chartOptions = {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Relationships Built",
                    data: relationshipData,
                    backgroundColor: "#9013FE",
                    borderColor: "#9013FE",
                    fill: false,
                },
                {
                    label: "Meetings Booked",
                    data: meetingsData,
                    backgroundColor: "#50E3C2",
                    borderColor: "#50E3C2",
                    fill: false,
                },
                {
                    label: "Emails Sent",
                    data: outboundData,
                    backgroundColor: "#1A9BFC",
                    borderColor: "#1A9BFC",
                    fill: false,
                },
            ],
        },
        options: {
            legend: {
                position: "bottom",
                labels: {
                    borderWidth: 0,
                    boxWidth: 10,
                    usePointStyle: true,
                    generateLabels: () => {
                        return [
                            { text: "Relationships Built", fillStyle: "#9013FE", strokeStyle: "rgba(0, 0, 0, 0.0)" },
                            { text: "Meetings Booked", fillStyle: "#50E3C2", strokeStyle: "rgba(0, 0, 0, 0.0)" },
                            { text: "Emails Sent", fillStyle: "#1A9BFC", strokeStyle: "rgba(0, 0, 0, 0.0)" },
                        ];
                    },
                },
                fontSize: 10,
                fontFamily: "proxima-nova, system-ui, Arial, Helvetica, sans-serif",
            },
            scales: {
                xAxes: [
                    {
                        ...axesDefault,
                        gridLines: {
                            drawOnChartArea: false,
                            drawTicks: true,
                            offsetGridLines: false,
                        },
                        barPercentage: 0.7,
                        categoryPercentage: 0.8,
                    },
                ],
                yAxes: [
                    {
                        ...axesDefault,
                        ticks: {
                            ...axesDefault.ticks,
                            padding: 10,
                            stepSize: Math.ceil(maxDataValue / 3),
                        },
                        display: true,
                    },
                ],
            },
        },
    };

    return chartOptions;
}

export function getStrengthChangeChartOptions(weeklyStrengthChange: Partial<StrengthChangeResult> = {}, weeks: number) {
    const { dtaPnt: data = [] } = weeklyStrengthChange;
    const dataToUse = data.slice(-weeks);
    const labels = dataToUse.map(p => format(p.strDte, "MMM D"));
    const strengthChangeData = dataToUse.map(p => p.relStrTtlDif + 4 * p.relStrStrDif); // eslint-disable-line
    const maxDataValue = strengthChangeData.reduce((acc, v) => Math.max(acc, Math.abs(v)), 0);
    const colours = strengthChangeData.map(strengthDelta => (strengthDelta < 0 ? "#ff5f5f" : "#1A9BFC"));
    const axesDefault = {
        ticks: {
            fontSize: 10,
            fontFamily: "proxima-nova, Arial, Helvetica, sans-serif",
            padding: 5,
            maxRotation: 0,
        },
    };
    const chartOptions = {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Strength change",
                    backgroundColor: colours,
                    data: strengthChangeData,
                },
            ],
        },
        options: {
            lineAtIndex: 0,
            annotation: {
                annotations: [
                    {
                        type: "line",
                        mode: "horizontal",
                        scaleID: "y-axis-0",
                        value: 0,
                        borderColor: "rgb(75, 192, 192)",
                        borderWidth: 2,
                        label: {
                            enabled: false,
                            content: "Test label",
                        },
                    },
                ],
            },
            legend: { display: false },
            scales: {
                xAxes: [
                    {
                        ...axesDefault,
                        gridLines: {
                            drawOnChartArea: false,
                            drawTicks: true,
                            offsetGridLines: false,
                        },
                        barPercentage: 0.7,
                        categoryPercentage: 0.6,
                    },
                ],
                yAxes: [
                    {
                        ...axesDefault,
                        ticks: {
                            ...axesDefault.ticks,
                            stepSize: Math.ceil(maxDataValue / 2),
                        },
                    },
                ],
            },
            tooltips: {
                mode: "nearest",
                intersect: false,
                callbacks: {
                    label: function(tooltipItem: { datasetIndex: number; yLabel: number }, data: { datasets: [{ label: string }] }) {
                        let label = data.datasets[tooltipItem.datasetIndex].label || "";
                        if (label) {
                            label += ": ";
                        }
                        label += tooltipItem.yLabel > 0 ? `+${tooltipItem.yLabel}` : tooltipItem.yLabel;
                        return label;
                    },
                },
            },
        },
    };

    return chartOptions;
}