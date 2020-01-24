import { ApiRequestMiddleware } from "../ApiInterfaces";
declare const withBaseAddress: (baseAddress: string) => ApiRequestMiddleware;
export default withBaseAddress;
