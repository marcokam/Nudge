import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";
import { emptyPromise } from "~/Util/PromiseUtils";

const emptyPromiseProducer = () => emptyPromise;
export const createMockResponse = (request: ApiRequest) => Promise.resolve({ 
    ok: true,
    url: request.url,
    status: 204,
    text: emptyPromiseProducer,
    json: emptyPromiseProducer,
    headers: null as any as Headers, //new Headers({})

    getText: emptyPromiseProducer,
    getJson: emptyPromiseProducer,
});
const methods = ["POST", "PUT", "DELETE"];

const disableSaveMiddleware = (disable: boolean): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {
    const isDisableSave = disable && methods.includes(request.method);
    return isDisableSave
        ? createMockResponse(request)
        : next(request);
};
export default disableSaveMiddleware;