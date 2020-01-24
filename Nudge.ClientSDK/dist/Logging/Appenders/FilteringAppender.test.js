import FilteringAppender from "./FilteringAppender";
import { LogLevel } from "../LoggingInterfaces";
import uuid from "uuid";
import { voidPromise } from "../../Util/PromiseUtils";
var MockAppender = /** @class */ (function () {
    function MockAppender() {
        var _this = this;
        this.events = [];
        this.append = function (event) { _this.events.push(event); return voidPromise; };
    }
    return MockAppender;
}());
var test = function (minLevel, loggedLevels, skippedLevels) {
    var mockAppender = new MockAppender();
    var filteringAppender = new FilteringAppender(minLevel, mockAppender);
    var shouldHave = [];
    loggedLevels.forEach(function (level) {
        var args = [1, "hello", false, {}, uuid()];
        var event = { level: level, args: function () { return args; } };
        filteringAppender.append(event);
        shouldHave.push(event);
    });
    skippedLevels.forEach(function (level) {
        var event = { level: level, args: function () { throw Error("This should not happen"); } };
        filteringAppender.append(event);
    });
    expect(mockAppender.events).toEqual(shouldHave);
};
it("minLevel error", function () {
    test(LogLevel.error, [LogLevel.error], [LogLevel.warning, LogLevel.info, LogLevel.debug]);
});
it("minLevel warning", function () {
    test(LogLevel.warning, [LogLevel.error, LogLevel.warning], [LogLevel.info, LogLevel.debug]);
});
it("minLevel info", function () {
    test(LogLevel.info, [LogLevel.error, LogLevel.warning, LogLevel.info], [LogLevel.debug]);
});
it("minLevel debug", function () {
    test(LogLevel.debug, [LogLevel.error, LogLevel.warning, LogLevel.info, LogLevel.debug], []);
});
//# sourceMappingURL=FilteringAppender.test.js.map