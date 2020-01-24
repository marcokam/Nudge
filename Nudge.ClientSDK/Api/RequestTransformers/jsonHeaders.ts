import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

//TODO: Combine with noCacheHeaders.ts into simple "withHeaders" function
const fixedHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json",
};

const jsonHeaders = (): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const nextRequest = {
        ...request,
        headers: {
            ...request.headers,
            ...fixedHeaders
        }
    };
    return next(nextRequest);
};
export default jsonHeaders;
