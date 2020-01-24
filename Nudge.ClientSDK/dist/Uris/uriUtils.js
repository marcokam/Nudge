import { either, tryCatch } from "../Util/fp/Instances/Either";
import { throwError } from "../Util/fp/error";
var throwInvalidUri = function () { return throwError("Invalid uri provided"); };
var tryCatchOnCondition = function (run) { return function (a) { return tryCatch(function () { return run(a); }); }; };
export var uriToId = function (uri) {
    if (uri === void 0) { uri = ""; }
    return either.of(uri)
        .chain(tryCatchOnCondition(function (uri) { return uri.includes("/")
        ? uri
        : throwInvalidUri(); }))
        .map(function (uri) { return uri.split("/"); })
        .chain(tryCatchOnCondition(function (parts) { return parts[parts.length - 1]
        ? parts[parts.length - 1]
        : throwInvalidUri(); }))
        .chain(tryCatchOnCondition(function (id) { return !isNaN(Number(id))
        ? id
        : throwInvalidUri(); }));
};
export var idToUri = function (baseUri) { return function (id) { return baseUri + "/" + id; }; };
//# sourceMappingURL=uriUtils.js.map