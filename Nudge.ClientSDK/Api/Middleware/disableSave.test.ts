import disableSaveMiddleware, { createMockResponse } from "./disableSave";
import { ApiRequest, ApiResponse } from "../ApiInterfaces";

const createRequest = (method: string): ApiRequest => ({ 
    url: "https://example.com/api/test",
    method
});

const expectResponsesEqual = async (r1: ApiResponse, r2: ApiResponse) => {
    expect(r1).toBeTruthy();
    expect(r2).toBeTruthy();
    expect(r1.url).toEqual(r2.url);
    expect(r1.status).toEqual(r2.status);
    expect(await r1.text()).toEqual(await r2.text());
    expect(await r1.json()).toEqual(await r2.json());
    expect(r1.headers).toEqual(r2.headers);
}

const createResponse = (request: ApiRequest): ApiResponse => ({
    ok: true,
    url: request.url, 
    status: 777, 
    text: () => Promise.resolve("5"),
    json: () => Promise.resolve(5),    
    headers: new Headers({})
});

it("disables POST", async () => {
    const middleware = disableSaveMiddleware(true);
    const request = createRequest("POST");
    const response = await middleware(request, () => { throw Error("Should not happen!"); });
    const expectedResponse = await createMockResponse(request);
    await expectResponsesEqual(response, expectedResponse);
});

it("does not disable GET", async () => {
    const middleware = disableSaveMiddleware(true);
    const request = createRequest("GET");
    const expectedResponse = createResponse(request);
    const response = await middleware(request, () => Promise.resolve(expectedResponse));
    await expectResponsesEqual(response, expectedResponse);
});

it("does not disable POST when off", async () => {
    const middleware = disableSaveMiddleware(false);
    const request = createRequest("POST");
    const expectedResponse = createResponse(request);
    const response = await middleware(request, () => Promise.resolve(expectedResponse));
    await expectResponsesEqual(response, expectedResponse);
});