var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { emptyControlConfiguration } from "./ConfigUIInterfaces";
import BuiltInControls from "./BuiltInControls";
import * as React from "react";
import registry from "../Util/registry";
import ContextFactory from "./ContextFactory";
import SdkLogCategories from "../Logging/Category/SdkLogCategories";
var logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);
var ControlManagerImpl = /** @class */ (function () {
    function ControlManagerImpl(controlDefinitions, parameterPersistence) {
        var _this = this;
        this.create = function (controlConfiguration, parent) {
            var fullControlConfiguration = Object.assign({}, emptyControlConfiguration, controlConfiguration);
            var typeName = fullControlConfiguration.type;
            if (!typeName) {
                throw Error("Type is required");
            }
            var def = _this.controlDefinitions[typeName];
            if (!def) {
                throw Error("Unable to locate ControlTypeDefinition for specified type " + typeName);
            }
            // Make sure if parameters and children aren't specified, we populate with empty object/array.
            // This can happen when config is deserialized or set in non-TypeScript code.
            var configCopy = __assign({ parameters: {}, children: [] }, fullControlConfiguration);
            var context = _this.contextFactory.createControlContext(fullControlConfiguration, parent);
            logger.debug("creating control " + typeName + " with parameters and context", fullControlConfiguration.parameters, parent.context);
            return def({
                controlManager: _this,
                controlConfiguration: configCopy,
                context: context,
                parent: parent,
            });
        };
        this.createRoot = function (config, inputParameters) {
            var controlConfiguration = config.rootControl || emptyControlConfiguration;
            return _this.contextFactory.createBoundaryContext(config.context || {}, inputParameters)
                .then(function (context) {
                var TopComponent;
                var rootComponent = /** @class */ (function (_super) {
                    __extends(RootComponent, _super);
                    function RootComponent(props) {
                        var _this = _super.call(this, props) || this;
                        _this.render = function () {
                            return (React.createElement(TopComponent, null));
                        };
                        return _this;
                    }
                    return RootComponent;
                }(React.Component));
                var rootConfig = {
                    type: "Root",
                    parameters: {},
                    children: [controlConfiguration],
                    inputParameters: [],
                    outputParameters: []
                };
                var rootInstance = {
                    controlConfiguration: rootConfig,
                    component: rootComponent,
                    context: context
                };
                var specifiedControl = _this.create(controlConfiguration, rootInstance);
                TopComponent = specifiedControl.component;
                return rootInstance;
            });
        };
        this.controlDefinitions = controlDefinitions;
        this.contextFactory = new ContextFactory(parameterPersistence);
    }
    return ControlManagerImpl;
}());
export default ControlManagerImpl;
;
//TODO: This should be a test as this is probably not used, mostly just asserts that BuiltInControls is the right type.
export var createWithBuiltInControls = function (parameterPersistence) {
    return new ControlManagerImpl(BuiltInControls, parameterPersistence);
};
export var combineDefinitions = function () {
    var controlDefinitions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        controlDefinitions[_i] = arguments[_i];
    }
    var combined = {};
    controlDefinitions.forEach(function (defs) { return Object.assign(combined, defs); });
    return combined;
};
//# sourceMappingURL=ControlManager.js.map