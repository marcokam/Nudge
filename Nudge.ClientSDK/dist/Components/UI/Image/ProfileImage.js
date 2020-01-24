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
import { getImgSrc, getImgSrcSet } from "../../../Util/imageUtils";
import { nameToInitials } from "../../../Util/nameUtils";
import { Task } from "../../../Util/fp/Instances/Task";
import { id } from "../../../Util/fp/function";
import ProfileInitials from "./ProfileInitials";
var ProfileImage = function (_a) {
    var uid = _a.uid, name = _a.name, src = _a.src, size = _a.size, className = _a.className, imageProps = __rest(_a, ["uid", "name", "src", "size", "className"]);
    var _b = __read(useState({ src: "", srcSet: "" }), 2), _c = _b[0], imgSrc = _c.src, imgSrcSet = _c.srcSet, setImg = _b[1];
    useEffect(function () {
        Task.of(nameToInitials(name))
            .chain(function (initials) {
            return Task.of(function (src) {
                return function (srcSet) { return ({ src: src, srcSet: srcSet }); };
            })
                .ap(getImgSrc(src, initials, size, false))
                .ap(getImgSrcSet(src, initials, size, false));
        })
            .fork(id, function (img) { return setImg(img); });
    }, [name, src, size]);
    return (imgSrc ?
        React.createElement("img", __assign({ src: imgSrc, alt: name, srcSet: imgSrcSet, width: size, height: size, className: className }, imageProps))
        : React.createElement(ProfileInitials, { uid: uid, initials: nameToInitials(name), className: className, size: size }));
};
export default ProfileImage;
//# sourceMappingURL=ProfileImage.js.map