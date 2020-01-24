import React from "react";
import ProfileImage from "~/App/Components/Profile/Image/ProfileImage.jsx";

export default function PersonProfile({
    size = 35,
    uri = "",
    name = "",
    title = "",
    imageUrl = "",
    imageTitle = "",
    className = "",
    ...containerProps
}) {
    const displayName = name || "Unknown";
    const displayTitle = imageTitle || [displayName, title].filter(Boolean).join(" • ");
    return (
        <div className={`flex items-center ${className}`} key={uri} {...containerProps} title={displayTitle}>
            {imageUrl && (
                <ProfileImage
                    uid={displayName}
                    src={imageUrl}
                    alt={displayName}
                    title={displayTitle}
                    className="br-100 flex-shrink-0"
                    size={size}
                />
            )}
            <div className={`f7 fw4 truncate ${imageUrl ? "ml2" : ""}`}>
                <span className="f6 fw6 nowrap">{name || "Unknown"}</span>
                {title && <br />}
                {title}
            </div>
        </div>
    );
}
