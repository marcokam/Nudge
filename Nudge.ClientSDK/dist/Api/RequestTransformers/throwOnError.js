import HttpError from "../Errors/HttpError";
var throwOnError = function () { return function (request, next) {
    return next(request)
        .then(function (response) {
        var statusCode = response.status;
        var isOk = statusCode >= 200 && statusCode <= 299;
        if (isOk) {
            return response;
        }
        throw new HttpError(response);
    });
}; };
export default throwOnError;
//# sourceMappingURL=throwOnError.js.map