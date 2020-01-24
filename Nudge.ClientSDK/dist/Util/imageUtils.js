import registry from "./registry";
import { Task } from "./fp/Instances/Task";
function isNudgeImage(url) {
    return registry.applicationServiceCdnURL
        .map(function (cdnUrl) { return url.indexOf(cdnUrl) === 0; });
}
function isCompanyImage(url) {
    return url.indexOf("/Company") >= 0;
}
function isEmpty(url) {
    return !url || (url.indexOf("emptystate_") > 0);
}
/**
 * Scales the image to a specific width and height given an algorithm
 * @param  {string} url       Image url
 * @param  {number} width     Width of the image
 * @param  {number} height    Height of the image
 * @param  {string} algorithm {crop, letterbox, shrink, shrinkAndFit}
 * @return {string}           Image url of scaled image
 */
export function getScaledImageURL(url, width, height, algorithm) {
    if (algorithm === void 0) { algorithm = "crop"; }
    // If it's not a Nudge image or width and height are not provided do 
    // no-op
    if (!isNudgeImage(url) || (!width && !height)) {
        return url;
    }
    var suffix = "type=" + algorithm;
    if (width) {
        suffix += "&width=" + width;
    }
    if (height) {
        suffix += "&height=" + height;
    }
    var joiningCharacter = url.indexOf("?") === -1 ? '?' : '&';
    return url + joiningCharacter + suffix;
}
export function getTextImageURL(text, width, height, color, backgroundColor) {
    if (color === void 0) { color = "5db9ff"; }
    if (backgroundColor === void 0) { backgroundColor = "cae8ff"; }
    return registry.applicationServiceCdnURL
        .map(function (cdnUrl) { return cdnUrl + "/image/text?value=" + text + "&color=" + backgroundColor + "&textcolor=" + color; })
        .map(function (fullUrl) { return getScaledImageURL(fullUrl, width, height); });
}
export function getImgSrc(url, text, size, shouldGetTextImage) {
    if (shouldGetTextImage === void 0) { shouldGetTextImage = true; }
    if (isEmpty(url)) {
        return shouldGetTextImage ? getTextImageURL(text, size, size) : Task.of("");
    }
    else {
        var algorithm = isCompanyImage(url) ? "letterbox" : "crop";
        return Task.of(getScaledImageURL(url, size, size, algorithm));
    }
}
export function getImgSrcSet(url, text, size, shouldGetTextImage) {
    if (shouldGetTextImage === void 0) { shouldGetTextImage = true; }
    return Task.of(function (image1x) {
        return function (image2x) {
            return function (image3x) { return image1x && image2x && image3x ? image1x + " 1x, " + image2x + " 2x, " + image3x + " 3x" : ""; };
        };
    })
        .ap(getImgSrc(url, text, size, shouldGetTextImage))
        .ap(getImgSrc(url, text, size * 2, shouldGetTextImage))
        .ap(getImgSrc(url, text, size * 3, shouldGetTextImage));
}
export var isImgEmpty = isEmpty;
//# sourceMappingURL=imageUtils.js.map