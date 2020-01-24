import React from "react";
import { getProfileColour } from "~/App/Utils/profileUtils.js";

import "./UIProfileInitials.scss";

const defaultProps = {
    className: "",
    title: "",
    initials: "",
    size: 30,
};
const UIProfileInitials = ({ uid, className, title, initials, size }) => {
    const backgroundColor = getProfileColour(uid);
    return (
        <div
            style={{ height: size, width: size, fontSize: Math.floor(size / 2.3) }}
            className={`profile-initials flex items-center justify-center white-90 ${backgroundColor} ${className}`}
            title={title}
        >
            {initials || "U"}
        </div>
    );
};

UIProfileInitials.displayName = "UIProfileInitials";
UIProfileInitials.defaultProps = defaultProps;

export default UIProfileInitials;
