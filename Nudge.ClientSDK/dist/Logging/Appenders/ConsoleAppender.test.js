import ConsoleAppender from "./ConsoleAppender";
import { LogLevel } from "../LoggingInterfaces";
;
var MockConsole = /** @class */ (function () {
    function MockConsole() {
        var _this = this;
        this.events = [];
        this.createFunc = function (level) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.events.push({ level: level, args: args });
        }; };
        this.error = this.createFunc(LogLevel.error);
        this.warn = this.createFunc(LogLevel.warning);
        this.log = this.createFunc(LogLevel.info);
        this.debug = this.createFunc(LogLevel.debug);
    }
    return MockConsole;
}());
var testLevel = function (level) {
    var mConsole = new MockConsole();
    var appender = new ConsoleAppender(mConsole);
    var args = [4, "hello", false];
    appender.append({ level: level, args: function () { return args; } });
    expect(mConsole.events).toEqual([{ level: level, args: args }]);
};
it("test error", function () {
    testLevel(LogLevel.error);
});
it("test warning", function () {
    testLevel(LogLevel.warning);
});
it("test info", function () {
    testLevel(LogLevel.info);
});
it("test debug", function () {
    testLevel(LogLevel.debug);
});
//# sourceMappingURL=ConsoleAppender.test.js.map