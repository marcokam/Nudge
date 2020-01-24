/**
 * Convert a proper name to it's corresponding 2 letter initials
 * 	e.x John Doe -> JD
 * @param  {string} name Full name (first and last name)
 * @return {string}      Initials
 */
export function nameToInitials(name) {
    if (name === void 0) { name = ""; }
    var arr = name.split(" ");
    var first = arr.shift() || "";
    var last = arr.pop() || "";
    return ("" + first.charAt(0) + last.charAt(0)).toUpperCase();
}
/**
 * Simple pluralizer
 *   Defaults to adding an `s` at the end
 *   Can use the optional replacement to change the pluralized word
 * @param {number} value Value to check if word should be pluralized
 * @param {string} word Word to pluralize
 * @param {string} [replacement] Optional replacement pluralized word
 * @return {string} Pluralized word
 */
export var simplePlural = function (value, word, replacement) {
    return (value === 0 || value > 1 ? replacement ? replacement : word + "s" : word);
};
export var truncateName = function (name, length) {
    if (name === void 0) { name = ""; }
    if (length === void 0) { length = 30; }
    return (name.length <= length ? name : name.slice(0, length) + "...");
};
//# sourceMappingURL=nameUtils.js.map