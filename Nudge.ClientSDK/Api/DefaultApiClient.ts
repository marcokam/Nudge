import ApiClient, { ApiRequestOptions, ApiRequest, ApiRequestInvoker, ApiResponse } from "./ApiInterfaces";

const optionsToRequest = (url: string, options: ApiRequestOptions): ApiRequest => {
    const method = options.method || "GET";
    return {
        url,
        ...options,
        method
    };
}

class DefaultApiClient implements ApiClient {


    private readonly invoker: ApiRequestInvoker;

    constructor(invoker: ApiRequestInvoker) {
        this.invoker = invoker;
    }
    
    private request = (url: string, options: ApiRequestOptions | undefined): Promise<ApiResponse> => {

        const request = optionsToRequest(url, options || {});
        return this.invoker(request);
    }

    private createRequestNoBody = (method: string) => (url: string, options?: ApiRequestOptions): Promise<ApiResponse> =>
        this.request(url, {
            method,
            ...options
        });

    private createRequestBody = (method: string) => (url: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse> =>
        this.request(url, {
            method,
            body: JSON.stringify(data),
            ...options
        });

    private json = (url: string, options: ApiRequestOptions | undefined): Promise<any> => {

        const request = optionsToRequest(url, options || {});
        return this.invoker(request)
            .then(response => {
                if (response.status === 204) {
                    return Promise.resolve(undefined);
                }
                return response.json();
            });
    }

    private createJsonNoBody = (method: string) => (url: string, options?: ApiRequestOptions): Promise<any> =>
        this.json(url, {
            method,
            ...options
        });

    private createJsonBody = (method: string) => (url: string, data: any, options?: ApiRequestOptions): Promise<any> =>
        this.json(url, {
            method,
            body: JSON.stringify(data),
            ...options
        });

    get = this.createRequestNoBody("GET");
    post = this.createRequestBody("POST");
    patch = this.createRequestBody("PATCH");
    delete = this.createRequestBody("DELETE");
    put = this.createRequestBody("PUT");    

    getJson = this.createJsonNoBody("GET");
    postJson = this.createJsonBody("POST");
    patchJson = this.createJsonBody("PATCH");
    deleteJson = this.createJsonBody("DELETE");
    putJson = this.createJsonBody("PUT");    
}

export default DefaultApiClient;