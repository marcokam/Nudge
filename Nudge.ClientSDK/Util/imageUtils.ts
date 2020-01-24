import registry from "~/Util/registry";
import { Task } from "./fp/Instances/Task";

function isNudgeImage(url: string) {
    return registry.applicationServiceCdnURL
        .map(cdnUrl => url.indexOf(cdnUrl)===0)
}

function isCompanyImage(url: string){
    return url.indexOf("/Company")>=0;
}

function isEmpty(url: string){
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
export function getScaledImageURL(url: string, width: number, height: number, algorithm="crop"){
    // If it's not a Nudge image or width and height are not provided do 
    // no-op
    if(!isNudgeImage(url) || (!width && !height)){
        return url;
    }

    let suffix = `type=${algorithm}`;
    if(width){
        suffix+=`&width=${width}`;
    }
    if(height){
        suffix+=`&height=${height}`;   
    }

    const joiningCharacter = url.indexOf("?")===-1 ? '?' : '&';
    return url + joiningCharacter + suffix;
}

export function getTextImageURL(text: string, width: number, height: number, color = "5db9ff", backgroundColor = "cae8ff") {
    return registry.applicationServiceCdnURL
        .map(cdnUrl => `${cdnUrl}/image/text?value=${text}&color=${backgroundColor}&textcolor=${color}`)
        .map(fullUrl => getScaledImageURL(fullUrl, width, height));
}

export function getImgSrc(url: string, text: string, size: number, shouldGetTextImage = true) {
    if(isEmpty(url)){
        return shouldGetTextImage ? getTextImageURL(text, size, size) : Task.of("");
    }
    else{
        const algorithm = isCompanyImage(url) ? "letterbox" : "crop";
        return Task.of(getScaledImageURL(url, size, size, algorithm));
    }
}

export function getImgSrcSet(url: string, text: string, size: number, shouldGetTextImage = true) {
    return Task.of((image1x: string): (s: string) => (t: string) => string =>
        (image2x: string): (s: string) => string =>
            (image3x: string): string => image1x && image2x && image3x ? `${image1x} 1x, ${image2x} 2x, ${image3x} 3x` : "")
        .ap(getImgSrc(url, text, size, shouldGetTextImage))
        .ap(getImgSrc(url, text, size * 2, shouldGetTextImage))
        .ap(getImgSrc(url, text, size * 3, shouldGetTextImage))
}

export const isImgEmpty = isEmpty;
