import React, { useState, useEffect } from "react";  // eslint-disable-line @typescript-eslint/no-unused-vars

import { getImgSrc, getImgSrcSet } from "~/Util/imageUtils";
import { nameToInitials } from "~/Util/nameUtils";
import { HtmlAttributes } from "csstype";
import { Task } from "~/Util/fp/Instances/Task";
import { id } from "~/Util/fp/function";
import ProfileInitials from "./ProfileInitials";

interface ProfileImageProps {
    uid: string;
    name: string;
    src: string;
    className: string;
    size: number;
    imageProps?: HtmlAttributes;
}

const ProfileImage: React.FunctionComponent<ProfileImageProps> = ({ uid, name, src, size, className, ...imageProps }) => {
    const [{ src: imgSrc, srcSet: imgSrcSet }, setImg] = useState({ src: "", srcSet: "" });

    useEffect(() => {
        Task.of(nameToInitials(name))
            .chain(initials =>
                Task.of((src: string): (ss: string) => { src: string; srcSet: string } =>
                    (srcSet: string) => ({ src, srcSet }))
                    .ap(getImgSrc(src, initials, size, false))
                    .ap(getImgSrcSet(src, initials, size, false))
            )
            .fork(id, img => setImg(img))
    }, [name, src, size]);

    return (
        imgSrc ?
            <img
                src={imgSrc}
                alt={name}
                srcSet={imgSrcSet}
                width={size}
                height={size}
                className={className}
                {...imageProps}
            />
            : <ProfileInitials
                uid={uid}
                initials={nameToInitials(name)}
                className={className}
                size={size}
            />
    );
};

export default ProfileImage;
