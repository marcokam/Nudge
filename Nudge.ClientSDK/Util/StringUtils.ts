const alphaNumericRegex = /^[a-z0-9]+$/i;
const alphaNumericUnderscoreRegex = /^[a-z0-9\_]+$/i;
export const isAlphaNumeric = (str: string) => !!str.match(alphaNumericRegex);
export const isAlphaNumericUnderscore = (str: string) => !!str.match(alphaNumericUnderscoreRegex);

export const fromTemplate = (template: string, parameters: any) => template.replace(/\${(.*?)}/g, (_, g) => parameters[g]);
export const prefixIfNotEmpty = (str: string, prefix: string): string => str ? prefix + str : str;