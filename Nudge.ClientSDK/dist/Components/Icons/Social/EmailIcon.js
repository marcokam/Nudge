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
export function EmailIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#666" : _b, containerProps = __rest(_a, ["fill"]);
    return (React.createElement("svg", __assign({ viewBox: "0 0 13 10" }, containerProps),
        React.createElement("path", { fill: fill, d: "M11.675,0 L1.125,0 C0.50545,0 0,0.5049 0,1.125 L0,8.625 C0,9.243 0.5032,9.75 1.125,9.75 L11.675,9.75 C12.293,9.75 12.8,9.2468 12.8,8.625 L12.8,1.125 C12.8,0.507 12.2968,0 11.675,0 Z M11.51965,0.75 L6.42385,5.845825 L1.283975,0.75 L11.51965,0.75 Z M0.75,8.4697 L0.75,1.276725 L4.361975,4.857725 L0.75,8.4697 Z M1.280325,9 L4.894575,5.38575 L6.161,6.6413 C6.3076,6.78665 6.544175,6.786175 6.690175,6.64015 L7.925,5.405325 L11.519675,9 L1.280325,9 Z M12.05,8.469675 L8.455325,4.875 L12.05,1.2803 L12.05,8.469675 Z" })));
}
//# sourceMappingURL=EmailIcon.js.map