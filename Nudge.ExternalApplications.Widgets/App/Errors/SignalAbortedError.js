export default class SignalAbortedError extends Error {
    constructor() {
        super();
        this.name = "SignalAbortedError";
        this.message = "Signal aborted";
    }
}
