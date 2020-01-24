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
import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "react-spring";
import * as logger from "../../Logging/DefaultLogger";
import { uriToId } from "../../Uris/uriUtils";
import { compose, noop } from "../../Util/fp/function";
import { filter } from "../../Util/fp/array";
import { propOr } from "../../Util/fp/object";
import { getEntity } from "../../Util/apiUtils";
import { NudgeUris } from "../../Uris/NudgeUris";
import { IdentityType, sortAndFilterIdentities } from "../../Data/Identity/identityData";
import { TeamInteractions } from "../Team/TeamInteractions";
import NudgeLink from "../UI/Link/NudgeLink";
import { socialIcons } from "../Icons/Social/icons";
import { ExternalLink } from "../UI/Link/ExternalLink";
import { option, tryCatch } from "../../Util/fp/Instances/Option";
import { EditIcon } from "../Icons/Icons";
import { flaggedDataReason } from "../../Data/Person/Metadata/flagData";
var defaultStyles = {
    minWidth: "24rem",
};
;
var getUniqueIdentities = function (identities) {
    return option.of(identities)
        .map(compose(sortAndFilterIdentities, filter(compose(function (type) { return type !== "facebook"; }, propOr("type", "")))))
        .getOrElse(function () { return []; });
};
export var PersonSummary = function (_a) {
    var person = _a.person, PersonProfile = _a.PersonProfile, _b = _a.style, style = _b === void 0 ? defaultStyles : _b, cache = _a.cache, _c = _a.flaggedUris, flaggedUris = _c === void 0 ? {} : _c, _d = _a.flagUri, flagUri = _d === void 0 ? noop : _d;
    var uri = person.uri, name = person.name, title = person.title, imageUrl = person.imageUrl, _e = person.teamInteractions, teamInteractions = _e === void 0 ? {} : _e, initialIdentities = person.identities;
    var _f = __read(useState(getUniqueIdentities(initialIdentities)), 2), identities = _f[0], setIdentities = _f[1];
    var _g = __read(useState(false), 2), edited = _g[0], setEdited = _g[1];
    var isEdited = edited || !!flaggedUris[uri];
    var _h = useSpring({
        opacity: isEdited ? 1 : 0,
        revOpacity: isEdited ? 0 : 1,
        transform: "perspective(600px) rotateX(" + (isEdited ? 180 : 0) + "deg)",
        config: config.stiff,
    }), transform = _h.transform, opacity = _h.opacity, revOpacity = _h.revOpacity;
    useEffect(function () {
        if (initialIdentities && initialIdentities.length === 0) {
            return;
        }
        var cancelled = false;
        getEntity(NudgeUris.v2.people(person.uri)._instanceUri, { fields: "uri,identities" }, { cache: cache })
            .fork(function (err) {
            if (cancelled)
                return;
            logger.error("Error getting identities", err);
        }, function (_a) {
            var identities = _a.identities;
            if (cancelled)
                return;
            setIdentities(getUniqueIdentities(identities));
        });
        return function () {
            cancelled = true;
        };
    }, [initialIdentities, person.uri, cache]);
    return (React.createElement("div", { className: "bg-white pa3 ba b--black-10 br2 shadow-4", style: style },
        React.createElement("header", { className: "mb2" },
            React.createElement("div", { className: "mt2" },
                React.createElement(PersonProfile, { size: 50, className: "mw6", name: name, title: title, imageUrl: imageUrl })),
            uri.startsWith("/v2/people") &&
                React.createElement("div", { className: "flex items-center justify-between h2 mt2" },
                    React.createElement("div", { className: "flex" },
                        React.createElement(NudgeLink, { className: "link nudge-blue mv1 f6 hover-underline", to: "/contactProfilePage?id=" + uriToId(uri).getOrElse(function () { return ""; }), onClick: function (event) {
                                event.stopPropagation();
                            } }, "View Profile"),
                        identities && identities.length > 0 && (React.createElement("div", { className: "flex items-center ml3" }, identities.map(function (_a) {
                            var _b = _a.type, type = _b === void 0 ? IdentityType.none : _b, _c = _a.identity, identity = _c === void 0 ? "" : _c, _d = _a.externalUrl, externalUrl = _d === void 0 ? "" : _d;
                            return tryCatch(function () { return socialIcons[type]; })
                                .map(function (_a) {
                                var Icon = _a.icon, style = _a.style;
                                return (React.createElement(ExternalLink, { key: identity, href: externalUrl, className: "dtc v-mid pr2 link dark-gray f7 dib", title: type === "twitter"
                                        ? "@" + identity
                                        : identity },
                                    React.createElement(Icon, { style: style })));
                            })
                                .getOrElse(function () { return null; });
                        })))),
                    React.createElement("div", { className: "relative w4-5 h-100 flex items-center justify-end" },
                        React.createElement(animated.div, { className: "absolute link nudge-blue f7 hover-underline pointer flex " + (isEdited ? "" : "z-1"), style: { opacity: revOpacity, transform: transform }, onClick: function () {
                                setEdited(function (state) { return !state; });
                                flagUri(uri);
                            } },
                            React.createElement(EditIcon, null),
                            React.createElement("span", { className: "ml1" }, "Flag as incorrect")),
                        React.createElement(animated.div, { className: "absolute pa1 bg-nudge-highlight-background nudge-highlight-text f7", style: { opacity: opacity, transform: transform.interpolate(function (t) { return t + " rotateX(180deg)"; }) } },
                            React.createElement("span", null, "Thanks! We'll review and update this profile shortly."),
                            React.createElement("a", { className: "link di underline pointer bg-animate hover-bg-washed-yellow ph1", onClick: function () {
                                    flagUri(uri, flaggedDataReason.incorrectCompany);
                                } }, "Hide profile"))))),
        React.createElement(TeamInteractions, { interactions: teamInteractions, PersonProfile: PersonProfile, person: person })));
};
//# sourceMappingURL=PersonSummary.js.map