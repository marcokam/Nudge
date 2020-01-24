import React, { useRef, useEffect } from "react";   // eslint-disable-line @typescript-eslint/no-unused-vars
import ChartJS from "chart.js";                     // eslint-disable-line import/extensions

interface ChartOptions {
    [prop: string]: any; 
}

export default function BaseChart({ chartOptions, ...attrs }: { chartOptions: ChartOptions }) {
    const containerRef = useRef(null as unknown as HTMLCanvasElement);

    useEffect(() => {
        new ChartJS(containerRef.current, chartOptions);
    }, [chartOptions]);

    return (
        <canvas ref={containerRef} {...attrs} />
    );
}
