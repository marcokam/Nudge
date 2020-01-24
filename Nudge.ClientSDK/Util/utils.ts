
//export const isFunction = (f: any) => f && f.call && f.apply;
export const isFunction = (f: any) => typeof f === "function";
export const resolveFunction: any
    = (f: any) => isFunction(f)
        ? f.call(null)
        : f;

export const resolveString = (f: any): string => {
    const resolved = resolveFunction(f);
    return typeof resolved === "string" ? resolved : JSON.stringify(resolved);
};

export const invariant = (condition: boolean, message: string): void | never => { if (!condition) throw Error(message); };
export const invariantTruthy = (value: any, message: string): void | never => invariant(!!value, message);

export const asyncScriptLoader = (src: string) => new Promise<void>((resolve, reject) => {
    //TODO: This is going to add the nonce for CSP via https://github.com/NudgeSoftware/nudge-app/blob/master/src/Nudge.WebApp.Web/Views/Shared/_createElementNonce.cshtml
    //      We'd like to remove this, so we'll need to add the nonce here ourselves.
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject();
    script.async = true;

    // Push the script element into <head>
    document.getElementsByTagName("head")[0].appendChild(script);
});