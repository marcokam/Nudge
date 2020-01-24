import { ApiRequestMiddleware } from "../ApiInterfaces";
import TokenManager from "../../Authentication/TokenManager";
declare const withTokenManager: (tokenManager: TokenManager) => ApiRequestMiddleware;
export default withTokenManager;
