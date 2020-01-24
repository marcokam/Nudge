import { ApiRequestMiddleware } from "../ApiInterfaces";
import Producer from "../../Util/fp/Instances/Producer";
declare const withHeader: (headerName: string, headerValueProducer: Producer<string>) => ApiRequestMiddleware;
export default withHeader;
