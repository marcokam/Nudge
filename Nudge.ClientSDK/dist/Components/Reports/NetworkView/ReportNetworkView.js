var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import { NudgeUris } from "../../../Uris/NudgeUris";
import NudgeLink from "../../UI/Link/NudgeLink";
import ProfileImage from "../../UI/Image/ProfileImage";
export var PersonProfile = function (_a) {
    var _b = _a.agg, agg = _b === void 0 ? {} : _b, _c = _a.size, size = _c === void 0 ? 30 : _c, containerProps = __rest(_a, ["agg", "size"]);
    var _d = agg.aggId, aggId = _d === void 0 ? 0 : _d, _e = agg.aggDspNam, aggDspNam = _e === void 0 ? "" : _e, _f = agg.imgThmUrl, imgThmUrl = _f === void 0 ? "" : _f;
    var uri = NudgeUris.v2.people("/v2/people/" + aggId)._instanceUri;
    return (React.createElement(NudgeLink, __assign({ key: uri, to: "/contactProfilePage?id=" + aggId, className: "link dib mr2 no-underline" }, containerProps),
        React.createElement(ProfileImage, { uid: aggDspNam, className: "person br-100", name: aggDspNam, src: imgThmUrl, size: size })));
};
export var CompanyProfile = function (_a) {
    var _b = _a.company, company = _b === void 0 ? {} : _b, _c = _a.size, size = _c === void 0 ? 30 : _c, containerProps = __rest(_a, ["company", "size"]);
    var _d = company.cmpAggId, cmpAggId = _d === void 0 ? 0 : _d, _e = company.cmpDspNam, cmpDspNam = _e === void 0 ? "" : _e, _f = company.lgoLrg, lgoLrg = _f === void 0 ? "" : _f;
    var uri = NudgeUris.v2.companies("/v2/companies/" + cmpAggId)._instanceUri;
    return (React.createElement(NudgeLink, __assign({ key: uri, to: "/companyDetailPage?id=" + cmpAggId, className: "link dib mr2 no-underline" }, containerProps),
        React.createElement(ProfileImage, { uid: cmpDspNam, className: "company br2", name: cmpDspNam, src: lgoLrg, size: size })));
};
//# sourceMappingURL=ReportNetworkView.js.map