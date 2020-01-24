import CustomError from "../../Util/CustomError";
import { ApiResponse } from "../ApiInterfaces";
export default class HttpError extends CustomError {
    readonly status: number;
    readonly url: string;
    readonly response: ApiResponse;
    constructor(response: ApiResponse);
}
