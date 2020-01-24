import { emptyPromise } from "../../Util/PromiseUtils";
var emptyPromiseProducer = function () { return emptyPromise; };
export var createMockResponse = function (request) { return Promise.resolve({
    ok: true,
    url: request.url,
    status: 204,
    text: emptyPromiseProducer,
    json: emptyPromiseProducer,
    headers: null,
    getText: emptyPromiseProducer,
    getJson: emptyPromiseProducer,
}); };
var methods = ["POST", "PUT", "DELETE"];
var disableSaveMiddleware = function (disable) { return function (request, next) {
    var isDisableSave = disable && methods.includes(request.method);
    return isDisableSave
        ? createMockResponse(request)
        : next(request);
}; };
export default disableSaveMiddleware;
//# sourceMappingURL=disableSave.js.map