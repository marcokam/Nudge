export default class TimeoutError extends Error {
    readonly timeout: number;
    readonly url: string;
    constructor(timeout: number, url: string);
}
