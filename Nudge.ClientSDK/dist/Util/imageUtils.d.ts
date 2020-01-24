import { Task } from "./fp/Instances/Task";
declare function isEmpty(url: string): boolean;
/**
 * Scales the image to a specific width and height given an algorithm
 * @param  {string} url       Image url
 * @param  {number} width     Width of the image
 * @param  {number} height    Height of the image
 * @param  {string} algorithm {crop, letterbox, shrink, shrinkAndFit}
 * @return {string}           Image url of scaled image
 */
export declare function getScaledImageURL(url: string, width: number, height: number, algorithm?: string): string;
export declare function getTextImageURL(text: string, width: number, height: number, color?: string, backgroundColor?: string): Task<unknown, string>;
export declare function getImgSrc(url: string, text: string, size: number, shouldGetTextImage?: boolean): Task<unknown, string>;
export declare function getImgSrcSet(url: string, text: string, size: number, shouldGetTextImage?: boolean): Task<unknown, string>;
export declare const isImgEmpty: typeof isEmpty;
export {};
