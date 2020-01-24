export default class TimeoutError extends Error {
    
    readonly timeout: number;
    readonly url: string;

    constructor(timeout: number, url: string) {
        super();
        this.name = "TimeoutError";
        this.message = `HTTP request timed out after ${timeout}ms on url ${url}`;
        this.timeout = timeout;
        this.url = url;
    }
}
