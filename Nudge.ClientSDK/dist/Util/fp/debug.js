import registry from "../registry";
export var tag = function (label) { return function (value) { return (registry.logger.debug(label, value), value); }; };
//# sourceMappingURL=debug.js.map