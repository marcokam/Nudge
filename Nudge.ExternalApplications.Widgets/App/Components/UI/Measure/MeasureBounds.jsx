import React from "react";
import Measure from "react-measure";

export default function MeasureBounds({ updateBounds, children }) {
    return (
        <Measure
            bounds
            onResize={contentRect => {
                updateBounds(contentRect.bounds);
            }}
            >
            {({ measureRef }) => {
                return <div ref={measureRef} >{children}</div>;
            }}
        </Measure>
    ); }