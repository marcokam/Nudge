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
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { numCompareByDir } from "../../../Util/sortUtils";
import { Compare } from "../../../Util/fp/Instances/Compare";
export var Tooltip = function (_a) {
    var children = _a.children, parent = _a.parent, targetSelector = _a.targetSelector, hide = _a.hide, _b = _a.className, className = _b === void 0 ? "" : _b, restProps = __rest(_a, ["children", "parent", "targetSelector", "hide", "className"]);
    var _c = __read(useState(), 2), target = _c[0], setTarget = _c[1];
    var _d = __read(useState({ width: 0 }), 2), selfBounds = _d[0], setSelfBounds = _d[1];
    // focus when shown
    var portalRef = useRef(null);
    useEffect(function () {
        var el = portalRef.current;
        var target = document.querySelector(targetSelector);
        if (!el || !target)
            return;
        el.focus();
        var bounds = el.getBoundingClientRect();
        setSelfBounds(bounds);
        setTarget(target);
        var onClick = function (event) {
            if (!event.target.closest("div.NudgeTooltip")) {
                hide();
            }
        };
        document.addEventListener("click", onClick, { capture: true, passive: true });
        return function () {
            document.removeEventListener("click", onClick, { capture: true });
        };
    }, [hide, targetSelector]);
    // remove when any scroll events happen
    // also hide when escape is used
    useEffect(function () {
        var hideOnEscape = function (event) {
            if (event && event.keyCode === 27) {
                hide();
            }
        };
        document.addEventListener("scroll", hide, { capture: true, once: true, passive: true });
        document.addEventListener("keyup", hideOnEscape, { capture: true, passive: true });
        return function () {
            document.removeEventListener("scroll", hide, { capture: true });
            document.removeEventListener("keyup", hideOnEscape, { capture: true });
        };
    }, [hide]);
    var allClassNames = "NudgeTooltip fixed border-box " + className;
    /**
     * We have the bounds of a parent and target element.  We want to calculate the best placement for this tooltip by calculating
     *   which direction has the most room between the bounds of the target and the parent.
     */
    var parentNode = parent ? parent : document.body;
    var parentBounds = parentNode && parentNode.getBoundingClientRect() || { top: 0, left: 0, right: Infinity, bottom: Infinity };
    var bounds = target && target.getBoundingClientRect();
    var leftSpace = bounds && (bounds.left - parentBounds.left);
    var rightSpace = bounds && (parentBounds.right - bounds.right);
    var byValue = Compare.of(numCompareByDir(false))
        .contramap(function (_a) {
        var _b = __read(_a, 2), _ = _b[0], s = _b[1];
        return s;
    });
    var bestX = [["left", leftSpace], ["right", rightSpace]]
        .sort(byValue.run)
        .map(function (_a) {
        var _b = __read(_a, 1), dir = _b[0];
        return dir;
    })
        .shift();
    var topSpace = bounds && (bounds.top - parentBounds.top);
    var bottomSpace = bounds && (parentBounds.bottom - bounds.bottom);
    var bestY = [["top", topSpace], ["bottom", bottomSpace]]
        .sort(byValue.run)
        .map(function (_a) {
        var _b = __read(_a, 1), dir = _b[0];
        return dir;
    })
        .shift();
    var portalChildren = (React.createElement("div", __assign({ ref: portalRef, tabIndex: 0, 
        // onBlur={hide}
        className: allClassNames, style: {
            opacity: selfBounds.width === 0 ? 0 : 1,
            top: (bestY === "top" || !bounds) ? "auto" : bounds.top,
            bottom: (bestY === "top" && bounds) ? window.innerHeight - bounds.bottom : "auto",
            left: (bestX === "left" || !bounds) ? "auto" : bounds.right,
            right: (bestX === "left" && bounds) ? window.innerWidth - bounds.left : "auto",
        } }, restProps), children));
    return ReactDOM.createPortal(portalChildren, document.body);
};
//# sourceMappingURL=Tooltip.js.map