export default class HttpError extends Error {
    constructor(response, body) {
        super();
        this.name = "HttpError";
        this.message = `HTTP request failed with status ${response.status}`;
        this.status = response.status;
        this.body = body || response.body;
        this.url = response.url;
    }
}
