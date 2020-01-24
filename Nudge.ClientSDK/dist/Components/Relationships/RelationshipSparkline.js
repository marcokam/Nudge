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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
var classNameMap = {
    veryStrong: "bg-dark-green",
    strong: "bg-green",
    medium: "bg-light-green",
    weak: "bg-washed-green",
    veryWeak: "bg-near-white",
    none: "bg-white",
    strongConnections: "bg-dark-green",
    activeConnections: "bg-near-white",
};
export var RelationshipSparkline = function (_a) {
    var height = _a.height, width = _a.width, _b = _a.transitionInMs, transitionInMs = _b === void 0 ? 300 : _b, _c = _a.className, className = _c === void 0 ? "" : _c, title = _a.title, data = _a.data;
    var total = data.total, relationshipValues = __rest(data, ["total"]);
    var relationshipEntries = Object.entries(relationshipValues);
    return (React.createElement("div", { className: "flex items-end " + className, style: { width: width, height: height }, title: title }, relationshipEntries.map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], val = _b[1];
        return (React.createElement("div", { key: key, className: classNameMap[key], style: {
                height: height,
                width: total ? (val / total) * width : 0,
                transition: "width " + transitionInMs + "ms",
                transitionTimingFunction: "ease-in-out",
            } }));
    })));
};
//# sourceMappingURL=RelationshipSparkline.js.map