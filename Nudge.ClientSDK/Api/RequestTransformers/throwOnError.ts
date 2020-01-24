import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";
import HttpError from "../Errors/HttpError";

const throwOnError = (): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    return next(request)
        .then(response => {
            const statusCode = response.status;
            const isOk = statusCode >= 200 && statusCode <= 299;
            if (isOk) {
                return response;
            }
            throw new HttpError(response);
        });
};
export default throwOnError;
