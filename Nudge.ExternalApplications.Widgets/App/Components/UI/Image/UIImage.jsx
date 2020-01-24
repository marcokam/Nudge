import React from "react";
import PropTypes from "prop-types";

import { nameToInitials } from "@nudge/client-sdk/Util/nameUtils";

import { getImgSrc, getImgSrcSet } from "~/App/Utils/imageUtils.js";

const propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.number,
};

function UIImage({ src, alt, title, className, size, onLoad, onError = () => {}, ...imageProps }) {
    const initials = nameToInitials(alt);
    const imgSrc = getImgSrc(src, initials, size, false);

    if (!imgSrc) {
        onError();
        return null;
    } else {
        const imgSrcSet = getImgSrcSet(src, initials, size, false);
        return (
            <img
                className={className}
                src={imgSrc}
                srcSet={imgSrcSet}
                alt={alt}
                title={title}
                width={size}
                height={size}
                onLoad={onLoad}
                onError={onError}
                {...imageProps}
            />
        );
    }
}
UIImage.propTypes = propTypes;

export default UIImage;
