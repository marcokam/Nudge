export interface TokenRefreshResponse {
    success: boolean;
    accessToken: string | null;
}
export default interface TokenManager {
    getAccessToken(): string | null;
    supportsRefresh: boolean;
    refreshAccessToken(): Promise<TokenRefreshResponse>;
}
