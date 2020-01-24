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
import React, { Component } from "react";
import registry from "../../Util/registry";
import { SimpleControlInstance } from "../Helpers";
;
;
var createSelector = function (selectorSettings) {
    return function (controlSettings) {
        var findElement = function (from, predicate) {
            if (from && from.length > 0) {
                return from.find(predicate) || null;
            }
            return null;
        };
        var findElementByUri = function (from, uri) { return findElement(from, function (e) { return e.uri === uri; }); };
        var findElementById = function (from, id) { return findElement(from, function (e) { return e.id === id; }); };
        var findElementByParams = function (params, elements) {
            var uri = params[selectorSettings.uriParameterName];
            if (uri) {
                return findElementByUri(elements, uri);
            }
            var id = params[selectorSettings.idParameterName];
            if (id) {
                return findElementById(elements, id);
            }
            return null;
        };
        var component = /** @class */ (function (_super) {
            __extends(SelectorHOC, _super);
            function SelectorHOC(props) {
                var _this = _super.call(this, props) || this;
                _this.componentDidMount = function () {
                    var startingParams = controlSettings.context.getParameters();
                    registry.logger.debug("SelectorHOC startingParams = ", startingParams);
                    selectorSettings.getData(startingParams)
                        .then(function (data) {
                        registry.logger.debug("got data", data);
                        var elements = data.elements;
                        var select = function (params) {
                            var selected = findElementByParams(params, elements);
                            if (selected) {
                                var selectedUri = selected.uri;
                                _this.setState({ elements: elements, loading: false, selectedUri: selectedUri });
                            }
                            else {
                                var first = (elements && elements.length > 0 && elements[0]) || null;
                                if (first) {
                                    _this.setState({ elements: elements, loading: false });
                                    _this.setSelected(first);
                                }
                            }
                        };
                        // Find selected
                        select(startingParams);
                        // Watch for changes to selected
                        controlSettings.context.subscribe(function (params) {
                            registry.logger.debug("SelectorHOC newParams = ", params);
                            select(params);
                        });
                    })
                        .catch(selectorSettings.onError);
                };
                _this.render = function () {
                    if (!_this.state || _this.state.loading) {
                        return React.createElement("div", null, "loading...");
                    }
                    //TODO: Error state
                    //TODO: Empty state
                    var children = _this.state.elements.map(function (element) { return React.createElement("option", { key: element.uri, value: element.uri }, element.displayName); });
                    var SelectComponent = selectorSettings.selectComponent;
                    return (React.createElement(SelectComponent, { selectedUri: _this.state.selectedUri, onChange: _this.onChangeSelector }, children));
                };
                _this.onChangeSelector = function (e) {
                    var uri = e.target.value;
                    var element = findElementByUri(_this.state.elements, uri);
                    registry.logger.debug("onChangeSelector: ", { uri: uri, element: element });
                    _this.setSelected(element);
                };
                _this.setSelected = function (element) {
                    var _a;
                    registry.logger.debug("selecting element", element);
                    var selectedId = element ? element.id : null;
                    var selectedUri = element ? element.uri : null;
                    controlSettings.context.setParameters((_a = {},
                        _a[selectorSettings.idParameterName] = selectedId,
                        _a[selectorSettings.uriParameterName] = selectedUri,
                        _a));
                };
                _this.state = {
                    elements: [],
                    selectedUri: "",
                    loading: true
                };
                return _this;
            }
            return SelectorHOC;
        }(Component));
        return new SimpleControlInstance(controlSettings.controlConfiguration, component, controlSettings.context, controlSettings.parent);
    };
};
export default createSelector;
//# sourceMappingURL=SelectorBase.js.map