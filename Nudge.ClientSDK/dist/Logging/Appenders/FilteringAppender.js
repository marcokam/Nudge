import { voidPromise } from "../../Util/PromiseUtils";
var FilteringAppender = /** @class */ (function () {
    function FilteringAppender(minimumLevel, nextAppender) {
        var _this = this;
        this.append = function (event) {
            if (event.level > _this.minimumLevel) {
                return voidPromise;
            }
            return _this.nextAppender.append(event);
        };
        this.minimumLevel = minimumLevel;
        this.nextAppender = nextAppender;
    }
    return FilteringAppender;
}());
export default FilteringAppender;
//# sourceMappingURL=FilteringAppender.js.map