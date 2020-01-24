import { ApiRequestMiddleware } from "../ApiInterfaces";
declare const timeoutAbortSignal: (defaultTimeoutMs: number) => ApiRequestMiddleware;
export default timeoutAbortSignal;
