import { ApiRequestTransformer, ApiRequestInvoker, AsyncApiRequestTransformer, ApiResponse } from "../ApiInterfaces";
import { ApiRequest } from "../ApiInterfaces";
declare const requestTransformerToMiddleware: (transformer: ApiRequestTransformer) => (request: ApiRequest, next: ApiRequestInvoker) => Promise<ApiResponse>;
export declare const asyncRequestTransformerAsyncToMiddleware: (transformer: AsyncApiRequestTransformer) => (request: ApiRequest, next: ApiRequestInvoker) => Promise<ApiResponse>;
export default requestTransformerToMiddleware;
