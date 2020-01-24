import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";
import TokenManager from "~/Authentication/TokenManager";
import { Logger } from "~/Logging/LoggingInterfaces";
import { promiseTry } from "~/Util/PromiseUtils";
import Producer, { toResult } from "~/Util/fp/Instances/Producer";
import { Task } from "~/Util/fp/Instances/Task";

function getJsonError(response: ApiResponse): any {
    return response.text().then(text => {
        if (typeof text === undefined || text === null) return text;

        try {
            return JSON.parse(text);
        } catch (err) {
            return text;
        }
    });
}

export function shouldRefreshAndRetry(status: number, jsonError: any) {
    //TODO: Allow e.code to be a string for when we eventually change the API contract                        
    return status === 401
        && jsonError
        && Array.isArray(jsonError)
        && jsonError.filter(e => e.code === 401001).length > 0;
}

const withAutoRefreshToken = (tokenManagerProducer: Producer<TokenManager>, logger: Logger): ApiRequestMiddleware => {
    
    const tokenManagerResult = toResult(tokenManagerProducer);
    return (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {

        if (request.accessToken) { 
            return next(request);       
        }

        return Task.toPromise<Error, TokenManager>(tokenManagerResult)
            .then(tokenManager => {
                const accessToken = tokenManager.getAccessToken();
                if (!accessToken) {
                    return next(request);
                }
        
                const nextRequest = {
                    accessToken,
                    ...request
                };
                return next(nextRequest)
                    .then(response => {
                        if (response.status != 401) {
                            return response;
                        }
        
                        return getJsonError(response)
                            .then((jsonError: any) => {
                                const url = nextRequest.url;
                            
                                function retryRequest(newAccessToken: string | null): Promise<ApiResponse> {
                                    if (accessToken === newAccessToken) {
                                        logger.warning(
                                            "While retrying the request, discovered that access token did not actually change",
                                            { url },
                                        );
                                        return Promise.resolve(response);
                                    }
                                    if (!newAccessToken) {
                                        logger.warning(
                                            "TokenManager indicated refresh was successful but did not return an access token.",
                                            { url },
                                        );
                                        return Promise.resolve(response);
                                    }
                            
                                    logger.info("Retrying API request", { url });
                                    const retryRequest = {
                                        ...nextRequest,
                                        accessToken: newAccessToken,
                                    };
                                    return next(retryRequest);
                                }
        
                        
                                // Do not attempt to refresh and retry if the access token was provided in options.
                                // This will stop retry and logger loops.
                                if (!tokenManager.supportsRefresh || request.accessToken || !shouldRefreshAndRetry(response.status, jsonError)) {
                                    return response;
                                }
            
                                // At this point we know we should retry the request.
                                // If the access token changed while the request was in flight, just use that during retry and do not perform a refresh.
                                const currentAccessToken = tokenManager.getAccessToken();
                                if (accessToken !== currentAccessToken) {
                                    return retryRequest(currentAccessToken);
                                }
                            
                                return promiseTry(() => tokenManager
                                    .refreshAccessToken()
                                    .then(refreshResponse => {
                                        if (!refreshResponse.success) {
                                            return response;
                                        }
                                        return retryRequest(refreshResponse.accessToken);
                                    })
                                ).catch(() => response);            
                            });
                    });
            });
    }


};
export default withAutoRefreshToken;