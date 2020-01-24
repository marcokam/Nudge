var noop = function () { };
var NullLogger = /** @class */ (function () {
    function NullLogger() {
        this.error = noop;
        this.warning = noop;
        this.info = noop;
        this.debug = noop;
        this.logEvent = noop;
    }
    return NullLogger;
}());
export default NullLogger;
//# sourceMappingURL=NullLogger.js.map