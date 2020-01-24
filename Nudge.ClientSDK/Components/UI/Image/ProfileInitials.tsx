import React from "react";
import { getProfileColour } from "~/Util/profileUtils";
import { HtmlAttributes } from "csstype";

interface ProfileInitialsProps {
    uid: string;
    className?: string;
    initials: string;
    size: number;
    containerProps?: HtmlAttributes;
}

const ProfileInitials: React.FunctionComponent<ProfileInitialsProps> = ({ uid, className = "", initials, size, ...containerProps }) => {
    const color = getProfileColour(uid);
    return (
        <div
            style={{ height: size, width: size, fontSize: Math.floor(size / 2.3) }}
            className={`profile-initials ${color} ${className}`}
            { ...containerProps }
        >
            {initials}
        </div>
    );
};

export default ProfileInitials;