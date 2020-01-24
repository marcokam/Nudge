import { mapAndJoinErrors } from "../../Util/PromiseUtils";
var MultiAppender = /** @class */ (function () {
    function MultiAppender(otherAppenders) {
        var _this = this;
        this.append = function (event) {
            return mapAndJoinErrors(_this.otherAppenders, function (appender) { return appender.append(event); })
                .then(); // Back to Promise<void> from Promise<void[]>
        };
        this.otherAppenders = otherAppenders;
    }
    return MultiAppender;
}());
export default MultiAppender;
//# sourceMappingURL=MultiAppender.js.map