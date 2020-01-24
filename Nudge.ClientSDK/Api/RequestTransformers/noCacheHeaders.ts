import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

const fixedHeaders = {
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "Expires": "0",
};

const noCacheHeaders = (): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const nextRequest = {
        ...request,
        headers: {
            ...request.headers,
            ...fixedHeaders
        }
    };
    return next(nextRequest);
};
export default noCacheHeaders;
