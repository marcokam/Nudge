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
import React from "react";
import { strengthToOrdering, RelationshipStrength } from "../../Data/Person/Relationship/relationshipData";
export var IconContainer = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.style, style = _c === void 0 ? {} : _c;
    return (React.createElement("div", { className: "icon-wrapper " + className, style: style }, children));
};
export function HomeIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#fff" : _b, _c = _a.containerStyles, containerStyles = _c === void 0 ? {} : _c, _d = _a.containerClassName, containerClassName = _d === void 0 ? "" : _d;
    var defaultContainerStyles = { padding: "7px 9px" };
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign(__assign({}, defaultContainerStyles), containerStyles) },
        React.createElement("svg", { width: "18px", height: "18px", viewBox: "0 0 18 18" },
            React.createElement("path", { fill: fill, d: "M16.482221,8.91333135 L16.482221,17.4193862 C16.482221,17.7309375 16.2245424,17.9897879 15.913192,17.9897879 L10.5655915,17.9897879 C10.2327121,17.9897879 9.975,17.7309375 9.975,17.4193862 L9.975,12.837221 L8.10666295,12.837221 L8.10666295,17.4193862 C8.10666295,17.7309375 7.84895089,17.9897879 7.53763393,17.9897879 L2.16850446,17.9897879 C1.8571875,17.9897879 1.59947545,17.7309375 1.59947545,17.4193862 C1.59947545,13.5374366 1.59947545,10.646247 1.59947545,8.74581738 L0.874475576,9.4621875 C0.671033357,9.69354911 0.346237575,9.70958705 0.157677786,9.4621875 C-0.0592350899,9.24914062 -0.0457644326,8.87802455 0.157677786,8.64666295 L8.63754475,0.193325893 C8.74119234,0.0764732143 8.86392827,0.0100446429 9.00539958,0.0100446429 C9.12795903,0.0100446429 9.25087143,0.0741964286 9.35434254,0.193325893 L17.8531214,8.71081473 C18.0559459,8.94448661 18.0418576,9.33391741 17.8531214,9.54924107 C17.7492679,9.64546875 17.6267379,9.70044643 17.4852665,9.70044643 C17.3248834,9.70044643 17.2019122,9.64546875 17.1174117,9.54924107 L16.482221,8.91333135 Z M2.7590625,7.60003304 L2.7590625,16.8283594 L6.93629464,16.8283594 L6.93629464,12.2462277 C6.93629464,11.9369531 7.20455357,11.6666518 7.53763393,11.6666518 L10.5655915,11.6666518 C10.8771429,11.6666518 11.1348549,11.9369866 11.1348549,12.2462277 L11.1348549,16.8283594 L15.3226339,16.8283594 L15.3226339,7.75243175 L9.00539958,1.42804687 L2.7590625,7.60003304 Z" }))));
}
export function NewsIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#fff" : _b, _c = _a.containerStyles, containerStyles = _c === void 0 ? {} : _c, _d = _a.containerClassName, containerClassName = _d === void 0 ? "" : _d;
    var defaultContainerStyles = {};
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign(__assign({}, defaultContainerStyles), containerStyles) },
        React.createElement("svg", { width: "15px", height: "15px", viewBox: "0 0 15 15", fill: fill },
            React.createElement("path", { d: "M13.59375,0 L3.28125,0 C2.50453125,0 1.875,0.6290625 1.875,1.40625 L1.875,2.34375 L1.40625,2.34375 C0.62953125,2.34375 0,2.9728125 0,3.75 L0,13.125 C0,14.1604687 0.83953125,15 1.875,15 L13.125,15 C14.1604687,15 15,14.1604687 15,13.125 L15,1.40625 C15,0.6290625 14.37,0 13.59375,0 Z M14.0625,13.125 C14.0625,13.6415625 13.6415625,14.0625 13.125,14.0625 L1.875,14.0625 C1.35796875,14.0625 0.9375,13.6415625 0.9375,13.125 L0.9375,3.75 C0.9375,3.49125 1.1475,3.28125 1.40625,3.28125 L1.875,3.28125 L1.875,12.65625 C1.875,12.9154688 2.08453125,13.125 2.34375,13.125 C2.60296875,13.125 2.8125,12.9154688 2.8125,12.65625 L2.8125,1.40625 C2.8125,1.1475 3.0225,0.9375 3.28125,0.9375 L13.59375,0.9375 C13.8520312,0.9375 14.0625,1.1475 14.0625,1.40625 L14.0625,13.125 Z", id: "Shape" }),
            React.createElement("path", { d: "M9.1396875,5.09609375 L12.8896875,5.09609375 C13.0195312,5.09609375 13.1240625,4.99109375 13.1240625,4.86171875 C13.1240625,4.73234375 13.0195312,4.62734375 12.8896875,4.62734375 L9.1396875,4.62734375 C9.01078125,4.62734375 8.9053125,4.73234375 8.9053125,4.86171875 C8.9053125,4.99109375 9.01078125,5.09609375 9.1396875,5.09609375 Z", id: "Path" }),
            React.createElement("path", { d: "M9.1396875,3.28359375 L12.8896875,3.28359375 C13.0195312,3.28359375 13.1240625,3.17859375 13.1240625,3.04921875 C13.1240625,2.91984375 13.0195312,2.81484375 12.8896875,2.81484375 L9.1396875,2.81484375 C9.01078125,2.81484375 8.9053125,2.91984375 8.9053125,3.04921875 C8.9053125,3.17859375 9.01078125,3.28359375 9.1396875,3.28359375 Z", id: "Path" }),
            React.createElement("path", { d: "M7.734375,12.251875 L3.984375,12.251875 C3.855,12.251875 3.75,12.3573438 3.75,12.48625 C3.75,12.6160938 3.855,12.720625 3.984375,12.720625 L7.734375,12.720625 C7.86328125,12.720625 7.96875,12.6160938 7.96875,12.48625 C7.96875,12.3573437 7.86375,12.251875 7.734375,12.251875 Z", id: "Path" }),
            React.createElement("path", { d: "M7.734375,10.5 L3.984375,10.5 C3.855,10.5 3.75,10.6054688 3.75,10.734375 C3.75,10.8642188 3.855,10.96875 3.984375,10.96875 L7.734375,10.96875 C7.86328125,10.96875 7.96875,10.8642188 7.96875,10.734375 C7.96875,10.6054688 7.86375,10.5 7.734375,10.5 Z", id: "Path" }),
            React.createElement("path", { d: "M12.890625,12.251875 L9.140625,12.251875 C9.01078125,12.251875 8.90625,12.3573438 8.90625,12.48625 C8.90625,12.6160938 9.01078125,12.720625 9.140625,12.720625 L12.890625,12.720625 C13.0195312,12.720625 13.125,12.6160938 13.125,12.48625 C13.125,12.3573437 13.0195312,12.251875 12.890625,12.251875 Z", id: "Path" }),
            React.createElement("path", { d: "M12.890625,10.5 L9.140625,10.5 C9.01078125,10.5 8.90625,10.6054688 8.90625,10.734375 C8.90625,10.8642188 9.01078125,10.96875 9.140625,10.96875 L12.890625,10.96875 C13.0195312,10.96875 13.125,10.8642188 13.125,10.734375 C13.125,10.6054688 13.0195312,10.5 12.890625,10.5 Z", id: "Path" }),
            React.createElement("path", { d: "M12.890625,7.033125 L3.984375,7.033125 C3.855,7.033125 3.75,7.138125 3.75,7.2675 C3.75,7.396875 3.855,7.501875 3.984375,7.501875 L12.890625,7.501875 C13.0195312,7.501875 13.125,7.396875 13.125,7.2675 C13.125,7.138125 13.0195312,7.033125 12.890625,7.033125 Z", id: "Path" }),
            React.createElement("path", { d: "M12.890625,8.7 L3.984375,8.7 C3.855,8.7 3.75,8.80546875 3.75,8.934375 C3.75,9.06421875 3.855,9.16875 3.984375,9.16875 L12.890625,9.16875 C13.0195312,9.16875 13.125,9.06421875 13.125,8.934375 C13.125,8.80546875 13.0195312,8.7 12.890625,8.7 Z", id: "Path" }),
            React.createElement("path", { d: "M4.21875,6.09375 L7.5,6.09375 C7.75921875,6.09375 7.96875,5.88421875 7.96875,5.625 L7.96875,2.345625 C7.96875,2.08640625 7.75921875,1.876875 7.5,1.876875 L4.21875,1.876875 C3.95953125,1.876875 3.75,2.08640625 3.75,2.345625 L3.75,5.625 C3.75,5.88375 3.95953125,6.09375 4.21875,6.09375 Z M4.6875,2.8125 L7.03125,2.8125 L7.03125,5.15625 L4.6875,5.15625 L4.6875,2.8125 Z", id: "Shape" }))));
}
export function SearchIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#fff" : _b, _c = _a.containerStyles, containerStyles = _c === void 0 ? {} : _c, _d = _a.containerClassName, containerClassName = _d === void 0 ? "" : _d;
    var defaultContainerStyles = { padding: "6.5px 9px" };
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign(__assign({}, defaultContainerStyles), containerStyles) },
        React.createElement("svg", { width: "18px", height: "19px", viewBox: "0 0 20 21" },
            React.createElement("path", { fill: fill, d: "M19.695,18.5310714 L14.8528571,13.495 C16.0978571,12.015 16.78,10.1528571 16.78,8.21428571 C16.78,3.685 13.095,0 8.56571429,0 C4.03642857,0 0.351428571,3.685 0.351428571,8.21428571 C0.351428571,12.7435714 4.03642857,16.4285714 8.56571429,16.4285714 C10.2660714,16.4285714 11.8864286,15.9157143 13.2717857,14.9421429 L18.1507143,20.0164286 C18.3546429,20.2282143 18.6289286,20.345 18.9228571,20.345 C19.2010714,20.345 19.465,20.2389286 19.6653571,20.0460714 C20.0910714,19.6364286 20.1046429,18.9571429 19.695,18.5310714 Z M8.56571429,2.14285714 C11.9135714,2.14285714 14.6371429,4.86642857 14.6371429,8.21428571 C14.6371429,11.5621429 11.9135714,14.2857143 8.56571429,14.2857143 C5.21785714,14.2857143 2.49428571,11.5621429 2.49428571,8.21428571 C2.49428571,4.86642857 5.21785714,2.14285714 8.56571429,2.14285714 Z" }))));
}
export function CalendarIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#fff" : _b, _c = _a.containerStyles, containerStyles = _c === void 0 ? {} : _c, _d = _a.containerClassName, containerClassName = _d === void 0 ? "" : _d;
    var defaultContainerStyles = { padding: "6px 9px" };
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign(__assign({}, defaultContainerStyles), containerStyles) },
        React.createElement("svg", { width: "18px", height: "18px", viewBox: "0 0 15 15" },
            React.createElement("g", { stroke: "none", strokeWidth: "1", fill: fill },
                React.createElement("path", { d: "M8.87,11.9557815 C10.7750568,11.9557815 11.7275851,11.9557815 11.7275851,11.9557815 C11.7275851,11.9557815 11.7275851,11.0638543 11.7275851,9.28 L8.87,9.28 L8.87,11.9557815 Z", id: "Shape", stroke: "#FFFFFF", strokeLinecap: "round", strokeLinejoin: "round" }),
                React.createElement("path", { d: "M13.2387097,1.59021272 L11.6729452,1.59021272 L11.6729452,0.721701788 C11.6729452,0.32309997 11.3498452,0 10.9511235,0 L10.8366723,0 C10.4380705,0 10.1150904,0.32309997 10.1150904,0.721701788 L10.1150904,1.59021272 L4.59063218,1.59021272 L4.59063218,0.721701788 C4.59063218,0.32309997 4.26753221,0 3.86905023,0 L3.75447918,0 C3.35587736,0 3.03289723,0.32309997 3.03289723,0.721701788 L3.03289723,1.59021272 L1.48534905,1.59021272 C0.66645361,1.59021272 0,2.25642665 0,3.07556177 L0,13.4728852 C0,14.291541 0.66645361,14.9582343 1.48534905,14.9582343 L13.2388295,14.9582343 C14.0576051,14.9582343 14.7241786,14.2916608 14.7241786,13.4728852 L14.7241786,3.07556177 C14.7240587,2.25642665 14.0574853,1.59021272 13.2387097,1.59021272 Z M13.34,13.58 L1.38,13.58 L1.38,4.69 L13.34,4.69 L13.34,13.58 Z", id: "Shape" })))));
}
export function AlertIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#fff" : _b, _c = _a.containerStyles, containerStyles = _c === void 0 ? {} : _c, _d = _a.containerClassName, containerClassName = _d === void 0 ? "" : _d;
    var defaultContainerStyles = { padding: "6px 9px" };
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign(__assign({}, defaultContainerStyles), containerStyles) },
        React.createElement("svg", { viewBox: "0 0 229.238 229.238", width: "18px", height: "18px" },
            React.createElement("path", { d: "M220.228,172.242c-20.606-17.82-39.675-42.962-39.675-105.734c0-36.353-29.576-65.928-65.93-65.928  c-36.359,0-65.939,29.575-65.939,65.928c0,62.829-19.062,87.946-39.686,105.751C3.28,177.239,0,184.411,0,191.937  c0,4.142,3.358,7.5,7.5,7.5h71.175c3.472,16.663,18.268,29.222,35.944,29.222s32.473-12.558,35.944-29.222h71.175  c4.142,0,7.5-3.358,7.5-7.5C229.238,184.35,225.95,177.167,220.228,172.242z M114.619,213.659c-9.34,0-17.321-5.929-20.381-14.222  H135C131.94,207.73,123.959,213.659,114.619,213.659z M17.954,184.437c0.273-0.296,0.564-0.578,0.871-0.845  c31.443-27.146,44.858-62.162,44.858-117.084c0-28.082,22.852-50.928,50.939-50.928c28.083,0,50.93,22.846,50.93,50.928  c0,54.872,13.417,89.887,44.876,117.091c0.307,0.265,0.598,0.544,0.872,0.838H17.954z", fill: fill }))));
}
export function RightChevronIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#1a9bfc" : _b, _c = _a.containerStyles, containerStyles = _c === void 0 ? {} : _c, _d = _a.containerClassName, containerClassName = _d === void 0 ? "" : _d;
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign({}, containerStyles) },
        React.createElement("svg", { width: "12px", height: "12px", viewBox: "0 0 32 32", style: { fill: fill } },
            React.createElement("path", { d: "M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z" }))));
}
export function EditIcon(_a) {
    var _b = _a.fill, fill = _b === void 0 ? "#1a9bfc" : _b, _c = _a.containerStyles, containerStyles = _c === void 0 ? {} : _c, _d = _a.containerClassName, containerClassName = _d === void 0 ? "" : _d;
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign({}, containerStyles) },
        React.createElement("svg", { x: "0px", y: "0px", width: "14px", height: "14px", viewBox: "0 0 14 14", style: { fill: fill } },
            React.createElement("path", { d: "M1,10l-1,4l4-1l7-7L8,3L1,10z M11,0L9,2l3,3l2-2L11,0z" }))));
}
export var WiFiIcon = function (_a) {
    var _b = _a.type, type = _b === void 0 ? "" : _b, _c = _a.level, level = _c === void 0 ? RelationshipStrength.none : _c, _d = _a.containerStyles, containerStyles = _d === void 0 ? { width: 25 } : _d, _e = _a.containerClassName, containerClassName = _e === void 0 ? "" : _e;
    var fillColour = type === "collab" ? "#1a9bfc" : "#4fab5c";
    var baseColour = "#ddd";
    var fillColours = [baseColour, baseColour, baseColour, baseColour, baseColour].map(function (c, i) { return (i < strengthToOrdering(level) ? fillColour : baseColour); });
    return (React.createElement(IconContainer, { className: containerClassName, style: __assign({}, containerStyles) },
        React.createElement("svg", { viewBox: "0 0 25 22" },
            React.createElement("path", { d: "M24.6447761,0.2964 L24.6447761,21.9436 L0.287313433,21.9436 L0.287313433,15.5284 C0.287313433,15.5284 13.6291045,13.2144 24.6447761,0.2964", id: "background", fill: "#fff" }),
            React.createElement("path", { d: "M2.39402985,16.69628 L2.39402985,20.08348 L5.55373134,20.08348 L5.55373134,15.94628 C4.43059701,16.29388 3.36604478,16.54748 2.39402985,16.69628", id: "1_bar", fill: fillColours[0] }),
            React.createElement("path", { d: "M6.60716418,15.58592 L6.60716418,20.08352 L9.76686567,20.08352 L9.76686567,14.29592 C8.68589552,14.79632 7.62955224,15.22752 6.60716418,15.58592", id: "2_bar", fill: fillColours[1] }),
            React.createElement("path", { d: "M10.8202985,13.80292 L10.8202985,20.08372 L13.98,20.08372 L13.98,12.04092 C12.9270149,12.68372 11.8684328,13.28012 10.8202985,13.80292", id: "3_bar", fill: fillColours[2] }),
            React.createElement("path", { d: "M15.0333955,11.37488 L15.0333955,20.08368 L18.193097,20.08368 L18.193097,9.11448 C17.1677239,9.92728 16.1072761,10.67688 15.0333955,11.37488", id: "4-bar", fill: fillColours[3] }),
            React.createElement("path", { d: "M19.2465299,20.08364 L22.4062313,20.08364 L22.4062313,5.19564 C21.4207836,6.27164 20.3614552,7.28604 19.2465299,8.23564 L19.2465299,20.08364 Z", id: "5_bar", fill: fillColours[4] }))));
};
//# sourceMappingURL=Icons.js.map