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
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(timeout, url) {
        var _this = _super.call(this) || this;
        _this.name = "TimeoutError";
        _this.message = "HTTP request timed out after " + timeout + "ms on url " + url;
        _this.timeout = timeout;
        _this.url = url;
        return _this;
    }
    return TimeoutError;
}(Error));
export default TimeoutError;
//# sourceMappingURL=TimeoutError.js.map