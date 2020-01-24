import { ApiRequestMiddleware } from "../ApiInterfaces";
import TokenManager from "../../Authentication/TokenManager";
import { Logger } from "../../Logging/LoggingInterfaces";
import Producer from "../../Util/fp/Instances/Producer";
export declare function shouldRefreshAndRetry(status: number, jsonError: any): boolean;
declare const withAutoRefreshToken: (tokenManagerProducer: Producer<TokenManager>, logger: Logger) => ApiRequestMiddleware;
export default withAutoRefreshToken;
