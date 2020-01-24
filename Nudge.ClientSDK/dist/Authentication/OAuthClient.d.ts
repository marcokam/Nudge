import { Result } from "../Util/fp/Instances/Task";
export declare enum GrantType {
    AuthorizationCode = "authorization_code",
    RefreshToken = "refresh_token"
}
export interface OAuthClientConfig {
    tokenPostUrl: string;
    clientId: string;
    clientSecret: string;
}
export declare enum TokenPostErrorCode {
    InvalidGrant = "invalid_grant"
}
interface TokenPostError {
    isSuccess: false;
    error?: TokenPostErrorCode;
}
interface TokenPostResponse {
    isSuccess: true;
    access_token: string;
    refresh_token: string;
    userName: string;
    expires_in: number;
    refresh_token_expires_in: number;
}
export declare function isTokenPostError(responseOrError: TokenPostError | TokenPostResponse): responseOrError is TokenPostError;
export default class OAuthClient {
    private readonly clientConfig;
    constructor(clientConfig: Result<OAuthClientConfig>);
    tokenPost: (grantType: GrantType, grantValue: string) => Promise<TokenPostError | TokenPostResponse>;
    useAuthorizationCode: (responseUrl: URL) => Promise<TokenPostError | TokenPostResponse>;
}
export {};
