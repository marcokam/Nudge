import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
var activityDirectionSymbol = function (a) { return (a >= 0 ? "▲" : a < 0 ? "▼" : ""); };
var activityPlusMinus = function (a) { return (a >= 0 ? "+ " : a < 0 ? "− " : ""); };
var activityColourClass = function (a) { return (a >= 0 ? "green" : a < 0 ? "red" : ""); };
var ActivityItem = function (_a) {
    var _b = _a.activity, activity = _b === void 0 ? 0 : _b, _c = _a.message, message = _c === void 0 ? undefined : _c, _d = _a.directionSymbolOverrideFn, directionSymbolOverrideFn = _d === void 0 ? activityDirectionSymbol : _d, _e = _a.plusMinusOverrideFn, plusMinusOverrideFn = _e === void 0 ? activityPlusMinus : _e, _f = _a.colourClassOverrideFn, colourClassOverrideFn = _f === void 0 ? activityColourClass : _f, _g = _a.fontClassname, fontClassname = _g === void 0 ? "f6" : _g;
    return (React.createElement("div", { className: "dt-row" },
        React.createElement("span", { className: "dtc nowrap pr2 fw6 " + fontClassname + " " + colourClassOverrideFn(activity) },
            directionSymbolOverrideFn(activity),
            " ",
            plusMinusOverrideFn(activity),
            Math.abs(activity)),
        React.createElement("span", { className: "dtc " + fontClassname }, message)));
};
export default ActivityItem;
//# sourceMappingURL=ActivityItem.js.map