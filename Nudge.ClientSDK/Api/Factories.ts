import { ApiRequestInvoker, ApiRequest, ApiRequestMiddleware } from "./ApiInterfaces";

import NudgeIterable from "~/Util/NudgeIterable";

export const addMiddleware =
    (baseInvoker: ApiRequestInvoker, middleware: ApiRequestMiddleware): ApiRequestInvoker =>    
        (request: ApiRequest) => middleware ? middleware(request, baseInvoker) : baseInvoker(request);

export const addMultipleMiddleware = (baseInvoker: ApiRequestInvoker, middlewares: Iterable<ApiRequestMiddleware | null>) =>
    NudgeIterable.fromIterable(middlewares)
        .reverse()
        .filter(m => !!m)        
        .reduce(
            (acc, m) => addMiddleware(acc, m as ApiRequestMiddleware),
            baseInvoker
        );
