import CustomError from "~/Util/CustomError";
import { ApiResponse } from "../ApiInterfaces";

export default class HttpError extends CustomError {

    public readonly status: number;
    public readonly url: string;
    public readonly response: ApiResponse;

    constructor(response: ApiResponse) {
        super();
        this.name = "HttpError";
        this.message = `HTTP request failed with status ${response.status}`;
        this.status = response.status;
        this.url = response.url;
        this.response = response;
    }
}
