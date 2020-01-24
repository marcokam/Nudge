import React, { Component } from "react";
import AsyncInitializer from "~/Util/AsyncInitializer";
import { asyncScriptLoader } from "~/Util/utils";
//import PropTypes from "prop-types";

// Allow window object to have twttr prop
declare var window: any;

//TODO: This library may need to be loaded differently in some clients (eg. Chrome Extension)
const twitterScriptLoader = new AsyncInitializer(() => asyncScriptLoader("https://platform.twitter.com/widgets.js").then(() => window.twttr.ready()));

interface Props {
    screenName: string;
    tweetLimit: number;
}
class TwitterTimelineEmbed extends Component<Props> {
    private unmounted: boolean = false;
    private readonly timelineContainer: React.RefObject<HTMLDivElement>
    constructor(props: Props) {
        super(props);
        this.timelineContainer = React.createRef();
    }
    render = () => {
        return <div ref={this.timelineContainer} />;
    }
    componentDidMount = () => {
        twitterScriptLoader.initialize().then(() => {
            if (this.unmounted) {
                return;
            }
            
            // See https://developer.twitter.com/en/docs/twitter-for-websites/timelines/guides/parameter-reference.html
            window.twttr.widgets.createTimeline(
                {
                    sourceType: "profile",
                    screenName: this.props.screenName,
                },
                this.timelineContainer.current,
                {
                    chrome: "noheader, nofooter, noborders, transparent",
                    dnt: true,
                    tweetLimit: this.props.tweetLimit || 3,
                });
        });
    }

    componentWillUnmount = () => {
        this.unmounted = true;
    }
}
//TODO: This is a TypeScript error.
// const propTypes = {
//     screenName: PropTypes.string.isRequired,
// };
//TwitterTimelineEmbed.propTypes = propTypes;

export default TwitterTimelineEmbed;