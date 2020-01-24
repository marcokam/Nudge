import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

const withStatusCodeOverride = (): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {

    if (!request.statusCodeOverride) { 
        return next(request);       
    }
    const nextRequest = {
        ...request,
        headers: {
            ...request.headers,
            "X-HTTP-Status-Code-Override": 200
        }        
    };
    return next(nextRequest)
        .then(response => {
            const originalStatusCodeString = response.headers.get("X-Original-Http-Status-Code");
            if (!originalStatusCodeString) {
                return response;
            }
            const originalStatusCode = parseInt(originalStatusCodeString, 10);
            if (!originalStatusCode) {
                return response;
            }

            return {
                ...response,
                status: originalStatusCode
            };
        });
};
export default withStatusCodeOverride;
