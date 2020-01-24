import React from "react";
import { HtmlAttributes } from "csstype";
interface ProfileImageProps {
    uid: string;
    name: string;
    src: string;
    className: string;
    size: number;
    imageProps?: HtmlAttributes;
}
declare const ProfileImage: React.FunctionComponent<ProfileImageProps>;
export default ProfileImage;
