import { select } from "d3-selection";

export const wifiIcon = (selector, fillColours = []) => {
    if (!selector) {
        return;
    }

    const svg = select(selector)
        .append("svg")
        .attr("width", "25px")
        .attr("height", "22px")
        .attr("viewBox", "0 0 25 22");

    // render background
    svg.append("path")
        .attr("id", "background")
        .attr("fill", "#fff")
        .attr(
            "d",
            "M24.6447761,0.2964 L24.6447761,21.9436 L0.287313433,21.9436 L0.287313433,15.5284 C0.287313433,15.5284 13.6291045,13.2144 24.6447761,0.2964",
        );

    // render bars
    svg.append("path")
        .attr("id", "1_bar")
        .attr("fill", fillColours[0])
        .attr(
            "d",
            "M2.39402985,16.69628 L2.39402985,20.08348 L5.55373134,20.08348 L5.55373134,15.94628 C4.43059701,16.29388 3.36604478,16.54748 2.39402985,16.69628",
        );
    svg.append("path")
        .attr("id", "2_bar")
        .attr("fill", fillColours[1])
        .attr(
            "d",
            "M6.60716418,15.58592 L6.60716418,20.08352 L9.76686567,20.08352 L9.76686567,14.29592 C8.68589552,14.79632 7.62955224,15.22752 6.60716418,15.58592",
        );
    svg.append("path")
        .attr("id", "3_bar")
        .attr("fill", fillColours[2])
        .attr(
            "d",
            "M10.8202985,13.80292 L10.8202985,20.08372 L13.98,20.08372 L13.98,12.04092 C12.9270149,12.68372 11.8684328,13.28012 10.8202985,13.80292",
        );
    svg.append("path")
        .attr("id", "4_bar")
        .attr("fill", fillColours[3])
        .attr(
            "d",
            "M15.0333955,11.37488 L15.0333955,20.08368 L18.193097,20.08368 L18.193097,9.11448 C17.1677239,9.92728 16.1072761,10.67688 15.0333955,11.37488",
        );
    svg.append("path")
        .attr("id", "5_bar")
        .attr("fill", fillColours[4])
        .attr(
            "d",
            "M19.2465299,20.08364 L22.4062313,20.08364 L22.4062313,5.19564 C21.4207836,6.27164 20.3614552,7.28604 19.2465299,8.23564 L19.2465299,20.08364 Z",
        );
};
