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
import CustomError from "./CustomError";
var AggregateError = /** @class */ (function (_super) {
    __extends(AggregateError, _super);
    function AggregateError(errors) {
        var _this = _super.call(this) || this;
        _this.errors = errors;
        return _this;
    }
    return AggregateError;
}(CustomError));
export default AggregateError;
//# sourceMappingURL=AggregateError.js.map