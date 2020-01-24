export var throwError = function (err) {
    if (err instanceof Error) {
        throw err;
    }
    throw new Error(err);
};
export var notImplemented = function () {
    throw "Not Implemented";
};
//# sourceMappingURL=error.js.map