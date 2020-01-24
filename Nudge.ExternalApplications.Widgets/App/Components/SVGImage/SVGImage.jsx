import React from "react";
import PropTypes from "prop-types";
import ReactSVG from "react-svg";

import "./SVGImage.scss";

export const IMAGES_PATH = "https://app.nudge.ai/Static/images/icons-svg";

export const SVGImageNames = {
    social: {
        facebook: "facebook.svg",
        twitter: "twitter.svg",
        linkedIn: "linkedin.svg",
        email: "email.svg",
        website: "website.svg",
        share: "share.svg",
        teams: "teams.svg",
    },
};

const propTypes = {
    name: PropTypes.string
};
const SVGImage = ({ name = "", className = "", ...restProps }) => (
    <ReactSVG
        className={`svg-image ${className}`}
        src={`${IMAGES_PATH}/${name}`}
        {...restProps}
    />
);
SVGImage.displayName = "SVGImage";
SVGImage.propTypes = propTypes;


export default SVGImage;
