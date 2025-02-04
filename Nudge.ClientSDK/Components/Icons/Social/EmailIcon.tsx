import React from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars

export function EmailIcon({ fill = "#666", ...containerProps }) {
    return (
        <svg viewBox="0 0 13 10" {...containerProps}>
            <path
                fill={fill}
                d="M11.675,0 L1.125,0 C0.50545,0 0,0.5049 0,1.125 L0,8.625 C0,9.243 0.5032,9.75 1.125,9.75 L11.675,9.75 C12.293,9.75 12.8,9.2468 12.8,8.625 L12.8,1.125 C12.8,0.507 12.2968,0 11.675,0 Z M11.51965,0.75 L6.42385,5.845825 L1.283975,0.75 L11.51965,0.75 Z M0.75,8.4697 L0.75,1.276725 L4.361975,4.857725 L0.75,8.4697 Z M1.280325,9 L4.894575,5.38575 L6.161,6.6413 C6.3076,6.78665 6.544175,6.786175 6.690175,6.64015 L7.925,5.405325 L11.519675,9 L1.280325,9 Z M12.05,8.469675 L8.455325,4.875 L12.05,1.2803 L12.05,8.469675 Z"
            />
        </svg>
    );
}
