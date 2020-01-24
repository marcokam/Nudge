var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { format } from "date-fns";
export function getWeeklyActivityChartOptions(weeklyActivity) {
    if (weeklyActivity === void 0) { weeklyActivity = {}; }
    var _a = weeklyActivity.dtaPnt, dtaPnt = _a === void 0 ? [] : _a;
    var labels = dtaPnt.map(function (p) { return p.TimeTick; });
    var relationshipData = dtaPnt.map(function (p) { return p.RelationshipGrowth; });
    var meetingsData = dtaPnt.map(function (p) { return p.Meetings; });
    var outboundData = dtaPnt.map(function (p) { return p.OutboundEmail; });
    var maxDataValue = relationshipData
        .concat(meetingsData)
        .concat(outboundData)
        .reduce(function (acc, v) { return Math.max(acc, Math.abs(v)); }, 0);
    var axesDefault = {
        ticks: {
            fontSize: 10,
            fontFamily: "proxima-nova, system-ui, Arial, Helvetica, sans-serif",
            padding: 5,
            maxRotation: 0,
        },
    };
    var chartOptions = {
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
                    generateLabels: function () {
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
                    __assign(__assign({}, axesDefault), { gridLines: {
                            drawOnChartArea: false,
                            drawTicks: true,
                            offsetGridLines: false,
                        }, barPercentage: 0.7, categoryPercentage: 0.8 }),
                ],
                yAxes: [
                    __assign(__assign({}, axesDefault), { ticks: __assign(__assign({}, axesDefault.ticks), { padding: 10, stepSize: Math.ceil(maxDataValue / 3) }), display: true }),
                ],
            },
        },
    };
    return chartOptions;
}
export function getStrengthChangeChartOptions(weeklyStrengthChange, weeks) {
    if (weeklyStrengthChange === void 0) { weeklyStrengthChange = {}; }
    var _a = weeklyStrengthChange.dtaPnt, data = _a === void 0 ? [] : _a;
    var dataToUse = data.slice(-weeks);
    var labels = dataToUse.map(function (p) { return format(p.strDte, "MMM D"); });
    var strengthChangeData = dataToUse.map(function (p) { return p.relStrTtlDif + 4 * p.relStrStrDif; }); // eslint-disable-line
    var maxDataValue = strengthChangeData.reduce(function (acc, v) { return Math.max(acc, Math.abs(v)); }, 0);
    var colours = strengthChangeData.map(function (strengthDelta) { return (strengthDelta < 0 ? "#ff5f5f" : "#1A9BFC"); });
    var axesDefault = {
        ticks: {
            fontSize: 10,
            fontFamily: "proxima-nova, Arial, Helvetica, sans-serif",
            padding: 5,
            maxRotation: 0,
        },
    };
    var chartOptions = {
        type: "bar",
        data: {
            labels: labels,
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
                    __assign(__assign({}, axesDefault), { gridLines: {
                            drawOnChartArea: false,
                            drawTicks: true,
                            offsetGridLines: false,
                        }, barPercentage: 0.7, categoryPercentage: 0.6 }),
                ],
                yAxes: [
                    __assign(__assign({}, axesDefault), { ticks: __assign(__assign({}, axesDefault.ticks), { stepSize: Math.ceil(maxDataValue / 2) }) }),
                ],
            },
            tooltips: {
                mode: "nearest",
                intersect: false,
                callbacks: {
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || "";
                        if (label) {
                            label += ": ";
                        }
                        label += tooltipItem.yLabel > 0 ? "+" + tooltipItem.yLabel : tooltipItem.yLabel;
                        return label;
                    },
                },
            },
        },
    };
    return chartOptions;
}
//# sourceMappingURL=ReportData.js.map