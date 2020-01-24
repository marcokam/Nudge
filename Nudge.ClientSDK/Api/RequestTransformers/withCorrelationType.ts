import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";

const headerName = "x-correlation-type";
const withCorrelationType = (type: string): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const nextRequest = {
        ...request,
        headers: {
            ...request.headers,
            [headerName]: type
        }
    };
    return next(nextRequest);
};
export default withCorrelationType;