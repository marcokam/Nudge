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
import CustomError from "../../Util/CustomError";
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(response) {
        var _this = _super.call(this) || this;
        _this.name = "HttpError";
        _this.message = "HTTP request failed with status " + response.status;
        _this.status = response.status;
        _this.url = response.url;
        _this.response = response;
        return _this;
    }
    return HttpError;
}(CustomError));
export default HttpError;
//# sourceMappingURL=HttpError.js.map