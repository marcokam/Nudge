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
import * as React from "react";
import uuid from "uuid";
import { SimpleControlInstance, sfcAsClass } from "../Helpers";
import LazyValue from "../../Util/LazyValue";
import registry from "../../Util/registry";
import NudgeIterable from "../../Util/NudgeIterable";
import SdkLogCategories from "../../Logging/Category/SdkLogCategories";
var logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);
export var simpleNestingClassFactory = function (constructor) {
    return function (settings) {
        var myInstance = null;
        var controlConfiguration = settings.controlConfiguration, controlManager = settings.controlManager, parent = settings.parent;
        var createChildren = function () { return controlConfiguration.children.map(function (child) { return controlManager.create(child, myInstance); }); };
        var lazyChildInstances = new LazyValue(createChildren);
        var getChildInstances = function () { return lazyChildInstances.getValue(); };
        var myComponent = constructor(__assign(__assign({}, settings), { getChildInstances: getChildInstances }));
        myInstance = new SimpleControlInstance(controlConfiguration, myComponent, settings.context, parent);
        return myInstance;
    };
};
export var conditionalStacked = function (predicate) { return simpleNestingClassFactory(function (settings) {
    var sfc = function () {
        var className = settings.controlConfiguration.parameters.className;
        return (React.createElement("div", { className: className || "stacked" }, predicate() ? settings.getChildInstances().map(function (child) {
            var ChildComponent = child.component;
            return React.createElement(ChildComponent, { key: child.key });
        }) : null));
    };
    sfc.displayName = "Stacked";
    return sfcAsClass(sfc, settings);
}); };
export var Stacked = conditionalStacked(function () { return true; });
var GridViewEmptyCell = /** @class */ (function (_super) {
    __extends(GridViewEmptyCell, _super);
    function GridViewEmptyCell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.render = function () {
            return (React.createElement("div", { className: "gridView-emptyCell" }));
        };
        return _this;
    }
    return GridViewEmptyCell;
}(React.Component));
export var GridView = simpleNestingClassFactory(function (settings) {
    var myKey = uuid();
    // Implictly assume that children are specified left-to-right then top-to-bottom
    var sfc = function () {
        //TODO: casting any to number, assumes values exist.
        var _a = settings.controlConfiguration.parameters, parameters = _a === void 0 ? {} : _a;
        var _b = parameters.className, className = _b === void 0 ? "gridView" : _b, _c = parameters.rowClassName, rowClassName = _c === void 0 ? "gridView-row" : _c, _d = parameters.cellClassName, cellClassName = _d === void 0 ? "gridView-cell" : _d;
        var rows = parameters.rows;
        var columns = parameters.columns;
        var children = settings.getChildInstances();
        var getChildComponent = function (row, column) {
            var index = ((row - 1) * columns) + (column - 1);
            if (index >= children.length) {
                return GridViewEmptyCell;
            }
            var child = children[index];
            logger.debug("GridView: cell (" + row + "," + column + ") = index " + index, child);
            return child.component;
        };
        logger.debug("rendering GridView with rows=" + rows + ", columns=" + columns);
        return (React.createElement("div", { className: className, key: "gridView-" + myKey }, NudgeIterable.fromRange(1, rows).map(function (rowNum) {
            logger.debug("rendering GridView row " + rowNum);
            return (React.createElement("div", { className: rowClassName, key: "gridView-" + myKey + "-row-" + rowNum }, NudgeIterable.fromRange(1, columns).map(function (columnNum) {
                var ChildComponent = getChildComponent(rowNum, columnNum);
                return (React.createElement("div", { className: cellClassName, key: "gridView-" + myKey + "-row-" + rowNum + "-col-" + columnNum },
                    React.createElement(ChildComponent, null)));
            }).toArray()));
        }).toArray()));
    };
    sfc.displayName = "GridView";
    return sfcAsClass(sfc, settings);
});
//# sourceMappingURL=NestingControls.js.map