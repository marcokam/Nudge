import React from "react";


export const splitTypes = {
    horizontal: "horizontal",
    vertical: "vertical",
};

export default function SplitControl(props) {
    const { className = "", splitType, toggleSplitType = () => {}, style = {} } = props;
    const boxClass = "flex justify-center w2 pb1 ba b--black-30";
    const highlightClass = "bg-black-60 white";

    return (
        <div className={`flex justify-center items-center black-60 pointer f4 ${className}`} style={style} onClick={toggleSplitType}>
            <span className={`${boxClass} ${splitType === splitTypes.vertical ? highlightClass : ""}`}>↔</span>
            <span className={`${boxClass} ${splitType === splitTypes.horizontal ? highlightClass : ""}`}>↕</span>
        </div>
    );
}