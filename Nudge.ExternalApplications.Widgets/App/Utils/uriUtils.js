/**
 * Convert a v2 api URI to a legacy ID which is used in large
 * parts of the codebase
 * @param  {string} uri Standars compliant URI
 * @return {string}     ID parsed from URI
 */
export function uriToID(uri="") {
    return uri.substr(uri.lastIndexOf("/") + 1);
}

export function getHostname(uri) {
    const el = document.createElement("a");
    el.href = uri;
    return el.hostname;
}

/**
 * Compare 2 arrays with entities to see if they contain the same entities
 * Assumes arrays are in the same sorted order
 */
const compareBy = propAccessFn => (a1, a2) => {
    return a1.length==a2.length && a1.every((v,i)=> propAccessFn(v) === propAccessFn(a2[i]));
};
export const isEqualByUri = compareBy(e => e.uri);