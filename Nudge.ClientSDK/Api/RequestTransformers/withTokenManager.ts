import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";
import TokenManager from "~/Authentication/TokenManager";

//TODO: Add auto-refresh + retry
const withTokenManager = (tokenManager: TokenManager): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {

    if (request.accessToken) { 
        return next(request);       
    }
    const accessToken = tokenManager.getAccessToken();    
    if (!accessToken) {
        return next(request);       
    }

    const nextRequest = {
        accessToken,
        ...request
    };
    return next(nextRequest);
};
export default withTokenManager;
