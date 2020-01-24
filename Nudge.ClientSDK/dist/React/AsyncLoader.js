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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Component } from "react";
var AsyncLoader = /** @class */ (function (_super) {
    __extends(AsyncLoader, _super);
    function AsyncLoader(props) {
        var _this = _super.call(this, props) || this;
        _this.unmounted = false;
        _this.state = {
            isLoading: true,
            isError: false
        };
        props.asyncChild
            .then(function (r) {
            if (_this.unmounted) {
                return;
            }
            _this.resolvedChild = r;
            _this.setState({
                isLoading: false
            });
        })
            //TODO: Log error
            .catch(function () {
            if (_this.unmounted) {
                return;
            }
            _this.setState({
                isLoading: false,
                isError: true
            });
        });
        return _this;
    }
    AsyncLoader.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    AsyncLoader.prototype.render = function () {
        var _a = this.state, isLoading = _a.isLoading, isError = _a.isError;
        if (isLoading) {
            return this.props.onLoading;
        }
        if (isError || !this.resolvedChild) {
            return this.props.onError;
        }
        var Child = this.resolvedChild;
        return (React.createElement(Child, null));
    };
    return AsyncLoader;
}(Component));
export default AsyncLoader;
//# sourceMappingURL=AsyncLoader.js.map