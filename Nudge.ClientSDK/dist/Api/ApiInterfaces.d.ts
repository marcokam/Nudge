export interface ApiRequest extends ApiRequestOptions {
    url: string;
    method: string;
    accessToken?: string;
    headers?: any;
    signal?: AbortSignal;
    timeout?: number;
    statusCodeOverride?: boolean;
}
export interface ApiResponse {
    ok: boolean;
    url: string;
    status: number;
    text: () => Promise<string | null>;
    json: () => Promise<any>;
    headers: Headers;
}
export interface ApiRequestOptions {
    method?: string;
    body?: string;
    accessToken?: string;
    headers?: any;
    timeout?: number;
    statusCodeOverride?: boolean;
}
export default interface ApiClient {
    get(url: string, options?: ApiRequestOptions): Promise<ApiResponse>;
    post(url: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse>;
    patch(url: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse>;
    delete(url: string, options?: ApiRequestOptions): Promise<ApiResponse>;
    put(url: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse>;
    getJson(url: string, options?: ApiRequestOptions): Promise<any>;
    postJson(url: string, data: any, options?: ApiRequestOptions): Promise<any>;
    patchJson(url: string, data: any, options?: ApiRequestOptions): Promise<any>;
    deleteJson(url: string, options?: ApiRequestOptions): Promise<any>;
    putJson(url: string, data: any, options?: ApiRequestOptions): Promise<any>;
}
export declare type ApiRequestMiddleware = (request: ApiRequest, next: ApiRequestInvoker) => Promise<ApiResponse>;
export declare type ApiRequestInvoker = (request: ApiRequest) => Promise<ApiResponse>;
export declare type ApiRequestTransformer = (request: ApiRequest) => ApiRequest;
export declare type AsyncApiRequestTransformer = (request: ApiRequest) => Promise<ApiRequest>;
