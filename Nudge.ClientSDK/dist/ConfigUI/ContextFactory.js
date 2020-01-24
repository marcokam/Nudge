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
import { emptyContextSettings, emptyControlConfiguration } from "./ConfigUIInterfaces";
import Subscribable from "./Subscribable";
import registry from "../Util/registry";
import * as StringUtils from "../Util/StringUtils";
import * as AreEquals from "../Comparison/AreEquals";
import SdkLogCategories from "../Logging/Category/SdkLogCategories";
var logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);
var findBoundaryContext = function (parent) {
    if (!parent || !parent.context || parent.context.isBoundary || !parent.parent) {
        return parent.context;
    }
    return findBoundaryContext(parent.parent);
};
export var convertParameterMappings = function (mappings) {
    var _a;
    var invalid = function (msg) { return new Error("Invalid mappings: " + msg); };
    if (!mappings) {
        return {};
    }
    if (Array.isArray(mappings)) {
        var result_1 = {};
        mappings.forEach(function (item) {
            if (typeof item === "string") {
                var itemStr = item;
                result_1[itemStr] = itemStr;
            }
            else {
                throw invalid("Array elements are not strings.");
            }
        });
        return result_1;
    }
    if (typeof mappings === "string") {
        var itemStr = mappings;
        return _a = {}, _a[itemStr] = itemStr, _a;
    }
    if (typeof mappings === "object") {
        var result_2 = {};
        (Object.keys(mappings)).forEach(function (key) {
            var value = mappings[key];
            if (typeof value === "string") {
                result_2[key] = value;
            }
            else {
                throw invalid("Object value not a string.");
            }
        });
        return result_2;
    }
    throw invalid("Invalid type (" + typeof mappings + ").");
};
var invertParameterMappings = function (mappings) {
    var result = {};
    Object.keys(mappings).forEach(function (key) { return result[mappings[key]] = key; });
    return result;
};
var mapParams = function (params, mapping) {
    // mapping = { "collinsListId": "listId" }
    var toMapKeys = Object.keys(mapping).filter(function (key) { return params[key]; });
    // If there's nothing to map, just return an empty object
    if (toMapKeys.length < 1) {
        return {};
    }
    var result = {};
    toMapKeys.forEach(function (key) {
        var targetKey = mapping[key];
        result[targetKey] = params[key];
    });
    return result;
};
// Merges parameters from 2 objects.  The second object wins conflicts.
var mergeParams = function (first, second) { return Object.assign({}, first, second); };
var ContextFactory = /** @class */ (function () {
    function ContextFactory(parameterPersistence) {
        var _this = this;
        this.createBoundaryContext = function (contextSettings, inputParameters) {
            var fullContextSettings = Object.assign({}, emptyContextSettings, contextSettings);
            var persisting = fullContextSettings.persistParameters && fullContextSettings.persistenceKey;
            var inputParamMappings = convertParameterMappings(fullContextSettings.inputParameters);
            var mappedInputParams = mapParams(inputParameters, inputParamMappings);
            var fixedAndInputParams = mergeParams(fullContextSettings.fixedParameters, mappedInputParams);
            var saveParamMapping = convertParameterMappings(fullContextSettings.persistParameters);
            var persistedParameterMappings = invertParameterMappings(saveParamMapping);
            var templatedPersistenceKey = StringUtils.fromTemplate(fullContextSettings.persistenceKey, fixedAndInputParams);
            //TODO: Allow nesting contexts?  Push params up to parent / Pull params down from parent.
            var persistedParamsPromise = persisting
                ? _this.parameterPersistence.getPersistedParams(templatedPersistenceKey)
                : Promise.resolve({});
            return persistedParamsPromise
                .then(function (persistedParams) {
                var persitedMapped = mapParams(persistedParams || {}, persistedParameterMappings);
                var mergedStartingParams = mergeParams(persitedMapped, fixedAndInputParams);
                var subscribableParams = new Subscribable(mergedStartingParams);
                var lastPersistedParams = persistedParams;
                var that = _this;
                function setParameters(newParams, save) {
                    var oldParams = subscribableParams.getValue();
                    var result = __assign(__assign({}, oldParams), newParams);
                    logger.debug("BoundaryContext setParameters called", { oldParams: oldParams, newParams: newParams, result: result });
                    if (persisting && save) {
                        var paramsToPersist = mapParams(result, saveParamMapping);
                        if (!AreEquals.shallowEquals(lastPersistedParams, paramsToPersist)) {
                            that.parameterPersistence.savePersistedParams(templatedPersistenceKey, paramsToPersist);
                        }
                        lastPersistedParams = paramsToPersist;
                    }
                    subscribableParams.setValue(result);
                }
                return {
                    getParameters: subscribableParams.getValue,
                    setParameters: function (newParams) { return setParameters(newParams, true); },
                    subscribe: subscribableParams.subscribe,
                    isBoundary: true
                };
            });
        };
        this.createControlContext = function (controlConfiguration, parent) {
            var fullControlConfiguration = Object.assign({}, emptyControlConfiguration, controlConfiguration);
            // Params on the control configuration itself are immutable.  Get them right away.
            var myParams = fullControlConfiguration.parameters;
            // Find the boundary context
            var boundaryContext = findBoundaryContext(parent);
            // Determine if no inputs
            var inputParamMappings = convertParameterMappings(fullControlConfiguration.inputParameters);
            var noInputs = Object.keys(inputParamMappings).length < 1;
            // Subscribe to changes on our boundary, and cache the results of a merge
            // for use in context.subscribe and context.getParameters
            var mappedBoundaryParams = mapParams(boundaryContext.getParameters(), inputParamMappings);
            var startingValue = mergeParams(myParams, mappedBoundaryParams);
            var subscribable = new Subscribable(startingValue);
            if (!noInputs) {
                boundaryContext.subscribe(function (boundaryParams) {
                    var mappedBoundaryParams = mapParams(boundaryParams, inputParamMappings);
                    return subscribable.setValue(mergeParams(myParams, mappedBoundaryParams));
                });
            }
            // Setup a setParameters function
            var outputParamMappings = convertParameterMappings(fullControlConfiguration.outputParameters);
            var noOutputs = Object.keys(outputParamMappings).length < 1;
            var setParameters = noOutputs
                ? function () { }
                : function (newParams) {
                    var mappedNewParams = mapParams(newParams, outputParamMappings);
                    logger.debug("ControlContext setParameters called", { newParams: newParams, mappedNewParams: mappedNewParams, outputParamMappings: outputParamMappings });
                    boundaryContext.setParameters(mappedNewParams);
                };
            return {
                subscribe: subscribable.subscribe,
                getParameters: subscribable.getValue,
                setParameters: setParameters,
                isBoundary: false
            };
        };
        this.parameterPersistence = parameterPersistence;
    }
    return ContextFactory;
}());
export default ContextFactory;
//# sourceMappingURL=ContextFactory.js.map