import { RaceTimeout } from "~/Util/PromiseUtils";
import TimeoutError from "../Errors/TimeoutError";
import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

const timeoutError = (defaultTimeoutMs: number): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const timeoutMs = request.timeout || defaultTimeoutMs;
    return RaceTimeout(next(request), timeoutMs)
        .then(result => {
            if (result == null) {
                throw new TimeoutError(timeoutMs, request.url);
            }
            return result as ApiResponse;
        })
};
export default timeoutError;