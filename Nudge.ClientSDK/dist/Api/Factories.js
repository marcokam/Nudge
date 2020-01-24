import NudgeIterable from "../Util/NudgeIterable";
export var addMiddleware = function (baseInvoker, middleware) {
    return function (request) { return middleware ? middleware(request, baseInvoker) : baseInvoker(request); };
};
export var addMultipleMiddleware = function (baseInvoker, middlewares) {
    return NudgeIterable.fromIterable(middlewares)
        .reverse()
        .filter(function (m) { return !!m; })
        .reduce(function (acc, m) { return addMiddleware(acc, m); }, baseInvoker);
};
//# sourceMappingURL=Factories.js.map