import { resolveFunction } from "../../Util/utils";
var FunctionArgumentResolver = /** @class */ (function () {
    function FunctionArgumentResolver() {
    }
    FunctionArgumentResolver.prototype.resolve = function (args) {
        return args == null
            ? []
            : args.map(resolveFunction);
    };
    return FunctionArgumentResolver;
}());
export default FunctionArgumentResolver;
//# sourceMappingURL=FunctionArgumentResolver.js.map