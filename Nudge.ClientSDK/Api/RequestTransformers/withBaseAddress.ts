import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

//NOTE: This requires a polyfil for URL for IE if a client wants to use this and support IE. (eg Outlook)
const withBaseAddress = (baseAddress: string): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const fullUrl = (new URL(request.url, baseAddress)).toString();
    const finalRequest = (fullUrl === request.url)
        ? request
        : {
            ...request,
            url: fullUrl
        };
    return next(finalRequest);
};
export default withBaseAddress;
