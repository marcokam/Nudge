var alphaNumericRegex = /^[a-z0-9]+$/i;
var alphaNumericUnderscoreRegex = /^[a-z0-9\_]+$/i;
export var isAlphaNumeric = function (str) { return !!str.match(alphaNumericRegex); };
export var isAlphaNumericUnderscore = function (str) { return !!str.match(alphaNumericUnderscoreRegex); };
export var fromTemplate = function (template, parameters) { return template.replace(/\${(.*?)}/g, function (_, g) { return parameters[g]; }); };
export var prefixIfNotEmpty = function (str, prefix) { return str ? prefix + str : str; };
//# sourceMappingURL=StringUtils.js.map