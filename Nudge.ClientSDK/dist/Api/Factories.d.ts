import { ApiRequestInvoker, ApiRequestMiddleware } from "./ApiInterfaces";
export declare const addMiddleware: (baseInvoker: ApiRequestInvoker, middleware: ApiRequestMiddleware) => ApiRequestInvoker;
export declare const addMultipleMiddleware: (baseInvoker: ApiRequestInvoker, middlewares: Iterable<ApiRequestMiddleware | null>) => ApiRequestInvoker;
