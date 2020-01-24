import { createTimeoutAbortSignal, joinAbortSignals } from "~/Util/PromiseUtils";
import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

const timeoutAbortSignal = (defaultTimeoutMs: number): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const timeoutMs = request.timeout || defaultTimeoutMs;
    const timeoutSignal = createTimeoutAbortSignal(timeoutMs);    
    const finalSignal = request.signal
        ? joinAbortSignals(timeoutSignal, request.signal)
        : timeoutSignal;
    return next({
        ...request,
        signal: finalSignal
    });
};
export default timeoutAbortSignal;