function isNudgeImage(url){
    return url.indexOf(Nudge.urls.applicationServicesCdn)===0;
}

function isCompanyImage(url){
    return url.indexOf("/Company")>=0;
}

function isEmpty(url){
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
export function getScaledImageURL(url, width, height, algorithm="crop"){
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

export function getTextImageURL(text, width, height, color = "5db9ff", backgroundColor = "cae8ff") {
    const url = `${Nudge.urls.applicationServicesCdn}/image/text?value=${text}&color=${backgroundColor}&textcolor=${color}`;
    return getScaledImageURL(url, width, height);
}

export function getImgSrc(url, text, size, shouldGetTextImage = true){
    if(isEmpty(url)){
        return shouldGetTextImage ? getTextImageURL(text, size, size) : "";
    }
    else{
        const algorithm = isCompanyImage(url) ? "letterbox" : "crop";
        return getScaledImageURL(url, size, size, algorithm);
    }
}

export function getImgSrcSet(url, text, size, shouldGetTextImage = true) {
    const image1x = getImgSrc(url, text, size, shouldGetTextImage);
    const image2x = getImgSrc(url, text, size * 2, shouldGetTextImage);
    const image3x = getImgSrc(url, text, size * 3, shouldGetTextImage);

    if (image1x && image2x && image3x) {
        return  `${image1x} 1x, ${image2x} 2x, ${image3x} 3x`;
    } else {
        return "";
    }
}

export const isImgEmpty = isEmpty;
