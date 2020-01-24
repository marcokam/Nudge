/// <reference types="react" />
interface ChartOptions {
    [prop: string]: any;
}
export default function BaseChart({ chartOptions, ...attrs }: {
    chartOptions: ChartOptions;
}): JSX.Element;
export {};
