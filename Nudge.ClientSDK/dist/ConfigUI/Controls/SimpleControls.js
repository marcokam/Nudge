// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { sfcFactory } from "../Helpers";
export var Heading = sfcFactory(function (settings) {
    return function () { return React.createElement("div", { className: "headingRow" },
        React.createElement("div", { className: "heading" }, settings.controlConfiguration.parameters.text)); };
});
//TODO: Allow styling?  Italics/small text
export var Text = sfcFactory(function (settings) {
    var _a = settings.controlConfiguration.parameters, text = _a.text, className = _a.className;
    return function () { return React.createElement("div", { className: className }, text); };
});
//# sourceMappingURL=SimpleControls.js.map