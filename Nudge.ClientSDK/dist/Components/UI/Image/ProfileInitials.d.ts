import React from "react";
import { HtmlAttributes } from "csstype";
interface ProfileInitialsProps {
    uid: string;
    className?: string;
    initials: string;
    size: number;
    containerProps?: HtmlAttributes;
}
declare const ProfileInitials: React.FunctionComponent<ProfileInitialsProps>;
export default ProfileInitials;
