import { ApiRequestMiddleware } from "../ApiInterfaces";
declare const timeoutError: (defaultTimeoutMs: number) => ApiRequestMiddleware;
export default timeoutError;
