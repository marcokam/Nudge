//export const isFunction = (f: any) => f && f.call && f.apply;
export var isFunction = function (f) { return typeof f === "function"; };
export var resolveFunction = function (f) { return isFunction(f)
    ? f.call(null)
    : f; };
export var resolveString = function (f) {
    var resolved = resolveFunction(f);
    return typeof resolved === "string" ? resolved : JSON.stringify(resolved);
};
export var invariant = function (condition, message) { if (!condition)
    throw Error(message); };
export var invariantTruthy = function (value, message) { return invariant(!!value, message); };
export var asyncScriptLoader = function (src) { return new Promise(function (resolve, reject) {
    //TODO: This is going to add the nonce for CSP via https://github.com/NudgeSoftware/nudge-app/blob/master/src/Nudge.WebApp.Web/Views/Shared/_createElementNonce.cshtml
    //      We'd like to remove this, so we'll need to add the nonce here ourselves.
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = function () { return resolve(); };
    script.onerror = function () { return reject(); };
    script.async = true;
    // Push the script element into <head>
    document.getElementsByTagName("head")[0].appendChild(script);
}); };
//# sourceMappingURL=utils.js.map