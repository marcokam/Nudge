import React, { useRef } from "react";

import "./LabelledRange.scss";

export default function LabelledRange({
    min = 0,
    step = 1,
    max = min + step,
    defaultValue = min,
    onChange = () => {},
    stepName = "",
    width = 120,
    height = 3,
}) {
    const range = [...Array((max - min) / step + 1).keys()].map(x => x * step + min);
    const sliderRef = useRef();

    return (
        <div className="flex flex-column">
            <div className="range">
                <input
                    ref={sliderRef}
                    type="range"
                    className="bg-transparent"
                    min={min}
                    max={max}
                    step={step}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    style={{ width, height }}
                />
            </div>
            <ul className="rangeLabels flex justify-between">
                {range.map((v, i) => (
                    <li
                        className={v === defaultValue ? "active selected" : null}
                        key={`range_${v}`}
                        onClick={() => {
                            const slider = sliderRef.current;
                            if (slider) {
                                const newValue = (i * step) + min;
                                slider.value = newValue;
                                onChange({ target: { value: newValue } });
                            }
                        }}
                    >{`${v} ${stepName}`}</li>
                ))}
            </ul>
        </div>
    );
}
