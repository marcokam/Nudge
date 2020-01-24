import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

//TODO: When we add auto-refresh + retry, this should not accept the token manager
const withBearerToken = (): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {

    if (!request.accessToken) {
        return next(request)
    }

    const nextRequest = {
        ...request,
        headers: {
            ...request.headers,
            "Authorization": `Bearer ${request.accessToken}`
        }
    };
    return next(nextRequest);
};
export default withBearerToken;
