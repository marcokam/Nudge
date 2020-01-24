/**
 * Convert a proper name to it's corresponding 2 letter initials
 * 	e.x John Doe -> JD
 * @param  {string} name Full name (first and last name)
 * @return {string}      Initials
 */
export declare function nameToInitials(name?: string): string;
/**
 * Simple pluralizer
 *   Defaults to adding an `s` at the end
 *   Can use the optional replacement to change the pluralized word
 * @param {number} value Value to check if word should be pluralized
 * @param {string} word Word to pluralize
 * @param {string} [replacement] Optional replacement pluralized word
 * @return {string} Pluralized word
 */
export declare const simplePlural: (value: number, word: string, replacement?: string | undefined) => string;
export declare const truncateName: (name?: string, length?: number) => string;
