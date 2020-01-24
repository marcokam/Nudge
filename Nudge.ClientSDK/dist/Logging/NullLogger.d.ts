import { Logger } from "./LoggingInterfaces";
export default class NullLogger implements Logger {
    error: () => void;
    warning: () => void;
    info: () => void;
    debug: () => void;
    logEvent: () => void;
}
