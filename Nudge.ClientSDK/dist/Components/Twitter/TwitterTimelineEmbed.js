var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component } from "react";
import AsyncInitializer from "../../Util/AsyncInitializer";
import { asyncScriptLoader } from "../../Util/utils";
//TODO: This library may need to be loaded differently in some clients (eg. Chrome Extension)
var twitterScriptLoader = new AsyncInitializer(function () { return asyncScriptLoader("https://platform.twitter.com/widgets.js").then(function () { return window.twttr.ready(); }); });
var TwitterTimelineEmbed = /** @class */ (function (_super) {
    __extends(TwitterTimelineEmbed, _super);
    function TwitterTimelineEmbed(props) {
        var _this = _super.call(this, props) || this;
        _this.unmounted = false;
        _this.render = function () {
            return React.createElement("div", { ref: _this.timelineContainer });
        };
        _this.componentDidMount = function () {
            twitterScriptLoader.initialize().then(function () {
                if (_this.unmounted) {
                    return;
                }
                // See https://developer.twitter.com/en/docs/twitter-for-websites/timelines/guides/parameter-reference.html
                window.twttr.widgets.createTimeline({
                    sourceType: "profile",
                    screenName: _this.props.screenName,
                }, _this.timelineContainer.current, {
                    chrome: "noheader, nofooter, noborders, transparent",
                    dnt: true,
                    tweetLimit: _this.props.tweetLimit || 3,
                });
            });
        };
        _this.componentWillUnmount = function () {
            _this.unmounted = true;
        };
        _this.timelineContainer = React.createRef();
        return _this;
    }
    return TwitterTimelineEmbed;
}(Component));
//TODO: This is a TypeScript error.
// const propTypes = {
//     screenName: PropTypes.string.isRequired,
// };
//TwitterTimelineEmbed.propTypes = propTypes;
export default TwitterTimelineEmbed;
//# sourceMappingURL=TwitterTimelineEmbed.js.map