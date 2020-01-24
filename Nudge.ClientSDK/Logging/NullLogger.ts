import { Logger } from "./LoggingInterfaces";

const noop = () => {};
export default class NullLogger implements Logger {
    error = noop;
    warning = noop;
    info = noop;
    debug = noop;
    logEvent = noop;
}