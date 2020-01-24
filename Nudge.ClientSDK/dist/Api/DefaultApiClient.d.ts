import ApiClient, { ApiRequestOptions, ApiRequestInvoker, ApiResponse } from "./ApiInterfaces";
declare class DefaultApiClient implements ApiClient {
    private readonly invoker;
    constructor(invoker: ApiRequestInvoker);
    private request;
    private createRequestNoBody;
    private createRequestBody;
    private json;
    private createJsonNoBody;
    private createJsonBody;
    get: (url: string, options?: ApiRequestOptions | undefined) => Promise<ApiResponse>;
    post: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<ApiResponse>;
    patch: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<ApiResponse>;
    delete: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<ApiResponse>;
    put: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<ApiResponse>;
    getJson: (url: string, options?: ApiRequestOptions | undefined) => Promise<any>;
    postJson: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<any>;
    patchJson: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<any>;
    deleteJson: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<any>;
    putJson: (url: string, data: any, options?: ApiRequestOptions | undefined) => Promise<any>;
}
export default DefaultApiClient;
