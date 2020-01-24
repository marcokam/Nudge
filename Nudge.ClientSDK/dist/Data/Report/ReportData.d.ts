import { WeeklyActivityResult, StrengthChangeResult } from "./ReportInterfaces";
export declare function getWeeklyActivityChartOptions(weeklyActivity?: Partial<WeeklyActivityResult>): {
    type: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            fill: boolean;
        }[];
    };
    options: {
        legend: {
            position: string;
            labels: {
                borderWidth: number;
                boxWidth: number;
                usePointStyle: boolean;
                generateLabels: () => {
                    text: string;
                    fillStyle: string;
                    strokeStyle: string;
                }[];
            };
            fontSize: number;
            fontFamily: string;
        };
        scales: {
            xAxes: {
                gridLines: {
                    drawOnChartArea: boolean;
                    drawTicks: boolean;
                    offsetGridLines: boolean;
                };
                barPercentage: number;
                categoryPercentage: number;
                ticks: {
                    fontSize: number;
                    fontFamily: string;
                    padding: number;
                    maxRotation: number;
                };
            }[];
            yAxes: {
                ticks: {
                    padding: number;
                    stepSize: number;
                    fontSize: number;
                    fontFamily: string;
                    maxRotation: number;
                };
                display: boolean;
            }[];
        };
    };
};
export declare function getStrengthChangeChartOptions(weeklyStrengthChange: Partial<StrengthChangeResult> | undefined, weeks: number): {
    type: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            backgroundColor: ("#1A9BFC" | "#ff5f5f")[];
            data: number[];
        }[];
    };
    options: {
        lineAtIndex: number;
        annotation: {
            annotations: {
                type: string;
                mode: string;
                scaleID: string;
                value: number;
                borderColor: string;
                borderWidth: number;
                label: {
                    enabled: boolean;
                    content: string;
                };
            }[];
        };
        legend: {
            display: boolean;
        };
        scales: {
            xAxes: {
                gridLines: {
                    drawOnChartArea: boolean;
                    drawTicks: boolean;
                    offsetGridLines: boolean;
                };
                barPercentage: number;
                categoryPercentage: number;
                ticks: {
                    fontSize: number;
                    fontFamily: string;
                    padding: number;
                    maxRotation: number;
                };
            }[];
            yAxes: {
                ticks: {
                    stepSize: number;
                    fontSize: number;
                    fontFamily: string;
                    padding: number;
                    maxRotation: number;
                };
            }[];
        };
        tooltips: {
            mode: string;
            intersect: boolean;
            callbacks: {
                label: (tooltipItem: {
                    datasetIndex: number;
                    yLabel: number;
                }, data: {
                    datasets: [{
                        label: string;
                    }];
                }) => string;
            };
        };
    };
};
