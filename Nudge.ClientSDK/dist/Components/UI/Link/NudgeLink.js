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
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import registry from "../../../Util/registry";
import { Task } from "../../../Util/fp/Instances/Task";
import * as logger from "../../../Logging/DefaultLogger";
import { ExternalLink } from "./ExternalLink";
var NudgeLink = function (_a) {
    var children = _a.children, to = _a.to, props = __rest(_a, ["children", "to"]);
    var _b = __read(useState({ baseUrl: "", waUrl: "" }), 2), urls = _b[0], setUrls = _b[1];
    useEffect(function () {
        var cancelled = false;
        Task.of(function (b) { return function (w) { return [b, w]; }; })
            .ap(registry.baseUrl)
            .ap(registry.webappBaseUrl)
            .fork(function (err) {
            if (cancelled)
                return;
            logger.error(err);
        }, function (_a) {
            var _b = __read(_a, 2), baseUrl = _b[0], waUrl = _b[1];
            if (cancelled)
                return;
            setUrls({
                baseUrl: baseUrl,
                waUrl: waUrl,
            });
        });
        return function () {
            cancelled = true;
        };
    }, []);
    var baseUrl = urls.baseUrl, waUrl = urls.waUrl;
    var isIntegrations = waUrl !== baseUrl;
    return waUrl ? (isIntegrations ? (React.createElement(ExternalLink, __assign({ href: waUrl + "/mobileui#" + to }, props), children)) : (React.createElement(Link, __assign({ to: to }, props), children))) : null;
};
export default NudgeLink;
//# sourceMappingURL=NudgeLink.js.map