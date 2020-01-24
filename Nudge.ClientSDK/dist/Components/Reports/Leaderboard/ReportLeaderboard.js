var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState, useEffect } from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars  
import ProfileImage from "../../UI/Image/ProfileImage";
import NudgeLink from "../../UI/Link/NudgeLink";
import registry from "../../../Util/registry";
import { id } from "../../../Util/fp/function";
export var LeaderboardRow = function (_a) {
    var _b = _a.rank, rank = _b === void 0 ? 0 : _b, user = _a.user, _c = _a.highlightUserId, highlightUserId = _c === void 0 ? 0 : _c, _d = _a.memberImageSize, memberImageSize = _d === void 0 ? 40 : _d, _e = _a.generateLink, generateLink = _e === void 0 ? function (userId) { return "/contactProfilePage?userId=" + userId; } : _e;
    var _f = user.usrIdn, usrIdn = _f === void 0 ? 0 : _f, _g = user.usrDspNam, usrDspNam = _g === void 0 ? "" : _g, _h = user.usrImgUrl, usrImgUrl = _h === void 0 ? "" : _h, _j = user.jobTtl, jobTtl = _j === void 0 ? "" : _j, _k = user.cmpNam, cmpNam = _k === void 0 ? "" : _k, networkHealthScore = user.networkHealthScore;
    var _l = networkHealthScore || {}, _m = _l.strong, strong = _m === void 0 ? 0 : _m, _o = _l.active, active = _o === void 0 ? 0 : _o;
    var _p = __read(useState(), 2), waUrl = _p[0], setWaUrl = _p[1];
    var to = generateLink(usrIdn);
    useEffect(function () {
        var cancelled = false;
        registry.webappBaseUrl.fork(id, function (waUrl) {
            if (cancelled)
                return;
            setWaUrl(waUrl);
        });
        return function () {
            cancelled = true;
        };
    }, []);
    return (React.createElement("tr", { className: highlightUserId === usrIdn ? "bg-nudge-light-blue" : "" },
        React.createElement("td", { className: "ph1 pv2", style: { width: 28 } },
            React.createElement(NudgeLink, { className: "link color-inherit truncate", to: to },
                rank,
                ".")),
        React.createElement("td", { className: "ph1 pv2", style: { width: 48 } },
            React.createElement(NudgeLink, { className: "link color-inherit truncate", to: to },
                React.createElement("div", { className: "flex" },
                    React.createElement(ProfileImage, { uid: usrDspNam, name: usrDspNam, src: usrImgUrl, size: memberImageSize, className: "person br-100" })))),
        React.createElement("td", { className: "ph1 pv2 w4 truncate" },
            React.createElement(NudgeLink, { className: "link color-inherit truncate", to: to },
                React.createElement("div", { className: "truncate fw6" }, usrDspNam),
                React.createElement("div", { className: "f7 flex items-center" },
                    waUrl && React.createElement("img", { src: waUrl + "/static/images/icons-sprite04-mobile/t3_lists_nhs.png", alt: "nhs" }),
                    React.createElement("span", { className: "dib tr mr1", style: { width: 25 } }, strong),
                    "|",
                    React.createElement("span", { className: "dib ml1 w3 tl" }, active)))),
        React.createElement("td", { className: "ph1 pv2 truncate" },
            React.createElement(NudgeLink, { className: "link color-inherit truncate", to: to },
                React.createElement("div", { className: "truncate" }, jobTtl),
                React.createElement("div", { className: "f7 truncate" }, cmpNam)))));
};
//# sourceMappingURL=ReportLeaderboard.js.map