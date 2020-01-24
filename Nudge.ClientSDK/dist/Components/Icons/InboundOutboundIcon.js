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
var _a, _b;
import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { EmailIcon } from "./Social/EmailIcon";
;
export var ioTypes = {
    inbound: "inbound",
    inboundFlipped: "inboundFlipped",
    outbound: "outbound",
    outboundFlipped: "outboundFlipped",
    conversation: "conversation",
};
var ioTitle = (_a = {},
    _a[ioTypes.inbound] = "inbound",
    _a[ioTypes.inboundFlipped] = "inbound",
    _a[ioTypes.outbound] = "outbound",
    _a[ioTypes.outboundFlipped] = "outbound",
    _a[ioTypes.conversation] = "conversation",
    _a);
export var ioColours = (_b = {},
    _b[ioTypes.inbound] = "#666",
    _b[ioTypes.inboundFlipped] = "#666",
    _b[ioTypes.outbound] = "#1a9bfc",
    _b[ioTypes.outboundFlipped] = "#1a9bfc",
    _b[ioTypes.conversation] = "#80c98a",
    _b);
export function InboundOutboundIcon(_a) {
    var type = _a.type, style = _a.style, _b = _a.className, className = _b === void 0 ? "" : _b, containerProps = __rest(_a, ["type", "style", "className"]);
    var color = ioColours[type];
    return (React.createElement("div", __assign({ style: __assign(__assign({}, style), { color: color }), className: className, title: ioTitle[type] }, containerProps),
        React.createElement("span", { style: { width: "13px" } }, [ioTypes.conversation, ioTypes.inbound, ioTypes.outboundFlipped].includes(type) && "←"),
        React.createElement(EmailIcon, { fill: color, style: { width: "15px" } }),
        React.createElement("span", { style: { width: "13px" } }, [ioTypes.conversation, ioTypes.outbound, ioTypes.inboundFlipped].includes(type) && "→")));
}
//# sourceMappingURL=InboundOutboundIcon.js.map