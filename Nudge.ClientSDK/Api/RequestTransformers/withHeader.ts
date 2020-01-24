import { ApiRequestMiddleware, ApiRequest, ApiRequestInvoker, ApiResponse } from "../ApiInterfaces";
import { Task } from "~/Util/fp/Instances/Task";
import Producer, { toResult } from "~/Util/fp/Instances/Producer";

const withHeader = (headerName: string, headerValueProducer: Producer<string>): ApiRequestMiddleware => (request: ApiRequest, next: ApiRequestInvoker): Promise<ApiResponse> => {

    const headerValueResult = toResult<string>(headerValueProducer);
    return Task.toPromise<Error, string>(headerValueResult)
        .then(value => {
            const nextRequest = {
                ...request,
                headers: {
                    ...request.headers,
                    [headerName]: value
                }
            };
            return next(nextRequest);
        });
};
export default withHeader;