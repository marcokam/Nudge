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
export function MeetingIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#666" : _b, containerProps = __rest(_a, ["fill"]);
    return (React.createElement("svg", __assign({}, containerProps, { viewBox: "0 0 15 15" }),
        React.createElement("g", { stroke: "none", strokeWidth: "1", fill: fill },
            React.createElement("path", { d: "M8.87,11.9557815 C10.7750568,11.9557815 11.7275851,11.9557815 11.7275851,11.9557815 C11.7275851,11.9557815 11.7275851,11.0638543 11.7275851,9.28 L8.87,9.28 L8.87,11.9557815 Z", id: "Shape", stroke: "#FFFFFF", strokeLinecap: "round", strokeLinejoin: "round" }),
            React.createElement("path", { d: "M13.2387097,1.59021272 L11.6729452,1.59021272 L11.6729452,0.721701788 C11.6729452,0.32309997 11.3498452,0 10.9511235,0 L10.8366723,0 C10.4380705,0 10.1150904,0.32309997 10.1150904,0.721701788 L10.1150904,1.59021272 L4.59063218,1.59021272 L4.59063218,0.721701788 C4.59063218,0.32309997 4.26753221,0 3.86905023,0 L3.75447918,0 C3.35587736,0 3.03289723,0.32309997 3.03289723,0.721701788 L3.03289723,1.59021272 L1.48534905,1.59021272 C0.66645361,1.59021272 0,2.25642665 0,3.07556177 L0,13.4728852 C0,14.291541 0.66645361,14.9582343 1.48534905,14.9582343 L13.2388295,14.9582343 C14.0576051,14.9582343 14.7241786,14.2916608 14.7241786,13.4728852 L14.7241786,3.07556177 C14.7240587,2.25642665 14.0574853,1.59021272 13.2387097,1.59021272 Z M13.34,13.58 L1.38,13.58 L1.38,4.69 L13.34,4.69 L13.34,13.58 Z", id: "Shape" }))));
}
//# sourceMappingURL=MeetingIcon.js.map