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
import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
export function LinkedInIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#777" : _b, containerProps = __rest(_a, ["fill"]);
    return (React.createElement("svg", __assign({ viewBox: "0 0 16 16" }, containerProps),
        React.createElement("g", { stroke: "none", strokeWidth: "1", fill: fill },
            React.createElement("path", { d: "M15.9672204,9.37514617 L15.9672204,15.2783295 L12.5449281,15.2783295 L12.5449281,9.7705058 C12.5449281,8.38689559 12.0499304,7.44263573 10.811174,7.44263573 C9.8655406,7.44263573 9.3027935,8.07899768 9.05522042,8.69457077 C8.96493735,8.91463573 8.94169838,9.22093735 8.94169838,9.52898376 L8.94169838,15.2783295 L5.51825522,15.2783295 C5.51825522,15.2783295 5.56436195,5.94988399 5.51825522,4.98338747 L8.94136427,4.98338747 L8.94136427,6.44265429 C8.93442227,6.45356845 8.92540139,6.46533643 8.91886775,6.47591647 L8.94136427,6.47591647 L8.94136427,6.44265429 C9.39615777,5.74218097 10.2083712,4.74153132 12.0263573,4.74153132 C14.2787193,4.7414942 15.9672204,6.21293735 15.9672204,9.37514617 Z M1.93718794,0.0207146172 C0.766032483,0.0207146172 0,0.788900232 0,1.79909049 C0,2.78726682 0.74387007,3.57876566 1.89174942,3.57876566 L1.91461717,3.57876566 C3.10845476,3.57876566 3.85091415,2.78741531 3.85091415,1.79909049 C3.82841763,0.788900232 3.10845476,0.0207146172 1.93718794,0.0207146172 Z M0.203322506,15.2783295 L3.62546636,15.2783295 L3.62546636,4.98338747 L0.203322506,4.98338747 L0.203322506,15.2783295 Z", id: "LinkedIn" }))));
}
//# sourceMappingURL=LinkedInIcon.js.map