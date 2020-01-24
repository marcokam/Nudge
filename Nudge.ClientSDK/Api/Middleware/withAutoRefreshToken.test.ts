import NonRefreshingTokenManager from "~/Authentication/NonRefreshingTokenManager";
import withAutoRefreshToken from "./withAutoRefreshToken";
import NullLogger from "~/Logging/NullLogger";
import { ApiRequest } from "../ApiInterfaces";
import TokenManager from "~/Authentication/TokenManager";

const logger = new NullLogger();

// Token Managers
class SimpleTokenManager implements TokenManager {
    private accessToken: number = 1;
    getAccessToken = () => this.accessToken.toString();
    supportsRefresh = true;
    refreshAccessToken = () => Promise.resolve({
        success: true,
        accessToken: (++this.accessToken).toString()
    });
    setAccessToken = (accessToken: number) => this.accessToken = accessToken;
}
const nonRefreshingTokenManager = new NonRefreshingTokenManager(() => "accessToken1");

// Requests
const apiUrl = "https://api.nudge.ai/v2/fake";
const simpleRequest: ApiRequest = {
    url: apiUrl,
    method: "GET"
};

// Responses
const accessDeniedResponseBody = [ { code: 401001 }];
const accessDeniedResponse = {
    ok: false,
    url: apiUrl,
    status: 401,
    text: () => Promise.resolve(JSON.stringify(accessDeniedResponseBody)),
    json: () => Promise.resolve(accessDeniedResponseBody),
    headers: null as any as Headers, // Jest doesn't have a Headers ctor at runtime?

    getText: () => Promise.resolve(JSON.stringify(accessDeniedResponseBody)),
    getJson: () => Promise.resolve(accessDeniedResponseBody),    
};
const successResponseBody = {};
const successResponse = {
    ok: true,
    url: apiUrl,
    status: 200,
    text: () => Promise.resolve(JSON.stringify(successResponseBody)),
    json: () => Promise.resolve(successResponseBody),
    headers: null as any as Headers, // Jest doesn't have a Headers ctor at runtime?

    getText: () => Promise.resolve(JSON.stringify(successResponseBody)),
    getJson: () => Promise.resolve(successResponseBody),    
};

// Invokers
const createInvoker = (...validTokens: string[]) => (request: ApiRequest) => 
    request.accessToken && validTokens.find(_ => _ === request.accessToken)
        ? Promise.resolve(successResponse)
        : Promise.resolve(accessDeniedResponse);

// Tests
it("doesn't attempt refresh from NonRefreshingTokenManager", async () => {
    const middleWare = withAutoRefreshToken(nonRefreshingTokenManager, logger);
    const response = await middleWare(simpleRequest, createInvoker());
    expect(response).toBe(accessDeniedResponse);
});

it("doesn't attempt refresh when access token supplied in request", async () => {
    const middleWare = withAutoRefreshToken(new SimpleTokenManager(), logger);
    const response = await middleWare({ ...simpleRequest, accessToken: "1" }, createInvoker("2"));
    expect(response).toBe(accessDeniedResponse);
});

it("refreshes and retries", async () => {
    const middleWare = withAutoRefreshToken(new SimpleTokenManager(), logger);
    const response = await middleWare(simpleRequest, createInvoker("2"));
    expect(response).toBe(successResponse);
});

it("uses new token when token changes during in-flight request", async () => {
    const validToken = "valid";
    let accessToken = "invalid";
    const tokenManager: TokenManager = { 
        getAccessToken: () => accessToken,
        supportsRefresh: true,
        refreshAccessToken: () => { throw Error("shouldn't do this"); }
    };
    const middleWare = withAutoRefreshToken(tokenManager, logger);
    const invoker = (request: ApiRequest) => {
        accessToken = validToken
        const response = request.accessToken === validToken
            ? successResponse
            : accessDeniedResponse;
        return Promise.resolve(response);
    }
    const response = await middleWare(simpleRequest, invoker);
    expect(response).toBe(successResponse);
});

it("returns original response when refresh throws", async () => {
    const tokenManager: TokenManager = { 
        getAccessToken: () => "invalid",
        supportsRefresh: true,
        refreshAccessToken: () => Promise.reject("Refresh failed")
    };
    const middleWare = withAutoRefreshToken(tokenManager, logger);
    const response = await middleWare(simpleRequest, createInvoker());
    expect(response).toBe(accessDeniedResponse);
});

it("returns original response when refresh returns false", async () => {
    const tokenManager: TokenManager = { 
        getAccessToken: () => "invalid",
        supportsRefresh: true,
        refreshAccessToken: () => Promise.resolve({ success: false, accessToken: "valid" })
    };
    const middleWare = withAutoRefreshToken(tokenManager, logger);
    const response = await middleWare(simpleRequest, createInvoker("valid"));
    expect(response).toBe(accessDeniedResponse);
});

it("returns original response when second request fails", async () => {    
    const middleWare = withAutoRefreshToken(new SimpleTokenManager(), logger);
    const response = await middleWare(simpleRequest, createInvoker());
    //TODO: This doesn't actually differentiate between 1st and 2nd requests
    expect(response).toBe(accessDeniedResponse);
});