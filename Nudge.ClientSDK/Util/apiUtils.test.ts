import { getEntity } from "./apiUtils";
import { ApiRequest, ApiResponse } from "~/Api/ApiInterfaces";
import DefaultApiClient from "~/Api/DefaultApiClient";
import registry from "./registry";

describe("getEntity", () => {
    it("constracts a url using the base and pass in url", async () => {
        const successResponse = { message: "SUCCESS" };
        registry.apiClient = new DefaultApiClient((request: ApiRequest): Promise<ApiResponse> => Promise.resolve({
            ok: true,
            url: request.url,
            status: 200,
            text: () => Promise.resolve(JSON.stringify(successResponse)),
            json: () => Promise.resolve(successResponse),
            headers: null as any as Headers
        }));
        const mockSuccessFn = jest.fn();
        const mockErrorFn = jest.fn();
        
        await getEntity("/test")
            .fork(mockErrorFn, mockSuccessFn);

        expect(mockErrorFn).not.toBeCalled();
        expect(mockSuccessFn).toBeCalledWith(successResponse);
    });
});