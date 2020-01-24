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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { Component } from "react";
import { v4 as uuid } from "uuid";
import registry from "../Util/registry";
import { convertParameterMappings } from "./ContextFactory";
import { entries } from "../Util/ObjectUtils";
import SdkLogCategories from "../Logging/Category/SdkLogCategories";
var logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);
var SimpleControlInstance = /** @class */ (function () {
    function SimpleControlInstance(controlConfiguration, component, context, parent) {
        logger.debug("creating SimpleControlInstance with parameters", controlConfiguration.parameters);
        this.controlConfiguration = controlConfiguration;
        this.component = component;
        this.context = context;
        this.parent = parent;
        this.key = uuid();
    }
    return SimpleControlInstance;
}());
export { SimpleControlInstance };
// export class SimpleControlInstanceFactory implements InstanceFactory {
//     private readonly componentFactory: (controlConfiguration: Configuration) => ComponentConstructor;    
//     constructor(componentFactory: (controlConfiguration: Configuration) => ComponentConstructor) {
//         this.componentFactory = componentFactory;
//     }
//     create(controlManager: Manager, controlConfiguration: Configuration, parent?: Instance): Instance {
//         const component = this.componentFactory(controlConfiguration);
//         return new SimpleControlInstance(controlConfiguration, component, parent);
//     }
// }
// export class ControlInstanceFactoryImpl implements InstanceFactory {
//     private readonly createFn: (controlManager: Manager, controlConfiguration: Configuration, parent?: Instance) => Instance;
//     constructor(createFn: (controlManager: Manager, controlConfiguration: Configuration, parent?: Instance) => Instance) {
//         this.createFn = createFn;
//     }
//     create(controlManager: Manager, controlConfiguration: Configuration, parent?: Instance): Instance {
//         return this.createFn(controlManager, controlConfiguration, parent);
//     }
// }
export var sfcAsClass = function (WrappedComponent, settings) {
    return /** @class */ (function (_super) {
        __extends(SfcToClass, _super);
        function SfcToClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SfcToClass.prototype.render = function () {
            var props = __assign(__assign({}, this.props), { context: settings.context });
            return React.createElement(WrappedComponent, __assign({}, props));
        };
        return SfcToClass;
    }(Component));
};
//TODO: The control manager can't actually deal with Promise<InstanceFactory>s
//      but this is going to be necessary in order to support lazy-loading of factories.
export var lazyInstanceFactory = function (factoryProducer) {
    return factoryProducer().then(function (factory) {
        return function (settings) { return factory(settings); };
    });
};
export var sfcFactory = function (componentFactory) {
    return function (settings) {
        var sfc = componentFactory(settings);
        var componentClass = sfcAsClass(sfc, settings);
        return new SimpleControlInstance(settings.controlConfiguration, componentClass, settings.context, settings.parent);
    };
};
export var componentConstructor = function (componentClass) {
    return function (settings) {
        return new SimpleControlInstance(settings.controlConfiguration, componentClass, settings.context, settings.parent);
    };
};
export var classFactory = function (constructor) {
    return function (settings) {
        var componentClass = constructor(settings);
        return new SimpleControlInstance(settings.controlConfiguration, componentClass, settings.context, settings.parent);
    };
};
var withParamsToPropsPrivate = function (componentClass) { return function (settings) {
    var ComponentClass = componentClass;
    logger.debug("creating ParamsToProps component with settings", settings, ComponentClass);
    var paramsToPropsClass = /** @class */ (function (_super) {
        __extends(ParamsToProps, _super);
        function ParamsToProps(props) {
            var _this = _super.call(this, props) || this;
            //TODO: Props don't change, we don't have to recalc in render() at all!
            _this.render = function () {
                // Include any props from parent component                
                var childProps = __assign(__assign(__assign({}, _this.props), _this.state.parameters), { setParameters: settings.context.setParameters });
                logger.info("rendering withParamsToProps", childProps);
                return React.createElement(ComponentClass, __assign({}, childProps));
            };
            // Set from initial props and context
            var parameters = settings.context.getParameters();
            _this.state = { parameters: parameters };
            settings.context.subscribe(function (parameters) { return _this.setState({ parameters: parameters }); });
            return _this;
        }
        return ParamsToProps;
    }(Component));
    return new SimpleControlInstance(settings.controlConfiguration, paramsToPropsClass, settings.context, settings.parent);
}; };
export var withParamsToProps = function (componentClass, settings) {
    if (settings) {
        return withParamsToPropsPrivate(componentClass)(settings);
    }
    return withParamsToPropsPrivate(componentClass);
};
export var willHaveParam = function (settings, paramName) {
    // Look for it on fixed parameters
    if (settings.controlConfiguration.parameters && settings.controlConfiguration.parameters[paramName] !== undefined) {
        return true;
    }
    // Look for it on inputParameters
    var convertedInputParams = convertParameterMappings(settings.controlConfiguration.inputParameters);
    return entries(convertedInputParams).any(function (e) { return e.value === paramName; });
};
//# sourceMappingURL=Helpers.js.map