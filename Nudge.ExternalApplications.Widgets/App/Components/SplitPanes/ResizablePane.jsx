import React from "react";

export default function ResizablePane(props) {
    const { isResizing = false, rerenderOnResize = false, children } = props;
    return (
        <div className={`flex h-100 w-100 justify-center items-center br bb b--black-10 ${isResizing ? "bg-near-white" : ""}`}>
            {isResizing && "Drag to resize"}
            {rerenderOnResize ? (
                isResizing ? null : (
                    children
                )
            ) : (
                <div className={isResizing ? "dn" : "h-100 w-100"}>{children}</div>
            )}
        </div>
    );
}
