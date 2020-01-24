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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useRef, useEffect } from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import ChartJS from "chart.js"; // eslint-disable-line import/extensions
export default function BaseChart(_a) {
    var chartOptions = _a.chartOptions, attrs = __rest(_a, ["chartOptions"]);
    var containerRef = useRef(null);
    useEffect(function () {
        new ChartJS(containerRef.current, chartOptions);
    }, [chartOptions]);
    return (React.createElement("canvas", __assign({ ref: containerRef }, attrs)));
}
//# sourceMappingURL=BaseChart.js.map