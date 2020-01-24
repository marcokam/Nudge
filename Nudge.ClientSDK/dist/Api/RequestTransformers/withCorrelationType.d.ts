import { ApiRequestMiddleware } from "../ApiInterfaces";
declare const withCorrelationType: (type: string) => ApiRequestMiddleware;
export default withCorrelationType;
