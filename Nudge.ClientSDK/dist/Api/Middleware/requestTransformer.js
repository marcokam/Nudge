var requestTransformerToMiddleware = function (transformer) { return function (request, next) {
    var newRequest = transformer(request);
    return next(newRequest);
}; };
export var asyncRequestTransformerAsyncToMiddleware = function (transformer) { return function (request, next) {
    return transformer(request)
        .then(function (newRequest) { return next(newRequest); });
}; };
export default requestTransformerToMiddleware;
//# sourceMappingURL=requestTransformer.js.map