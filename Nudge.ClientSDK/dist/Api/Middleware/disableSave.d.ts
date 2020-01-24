import { ApiRequestMiddleware, ApiRequest } from "../ApiInterfaces";
export declare const createMockResponse: (request: ApiRequest) => Promise<{
    ok: boolean;
    url: string;
    status: number;
    text: () => Promise<null>;
    json: () => Promise<null>;
    headers: Headers;
    getText: () => Promise<null>;
    getJson: () => Promise<null>;
}>;
declare const disableSaveMiddleware: (disable: boolean) => ApiRequestMiddleware;
export default disableSaveMiddleware;
