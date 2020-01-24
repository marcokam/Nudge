import { ApiRequestTransformer, ApiRequestInvoker, AsyncApiRequestTransformer, ApiResponse } from "../ApiInterfaces";
import { ApiRequest } from "../ApiInterfaces";

const requestTransformerToMiddleware = (transformer: ApiRequestTransformer) => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const newRequest = transformer(request);
    return next(newRequest);
};
export const asyncRequestTransformerAsyncToMiddleware = (transformer: AsyncApiRequestTransformer) => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    return transformer(request)
        .then((newRequest: ApiRequest) => next(newRequest));
}
export default requestTransformerToMiddleware;