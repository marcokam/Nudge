import { Component } from "react";
interface Props {
    screenName: string;
    tweetLimit: number;
}
declare class TwitterTimelineEmbed extends Component<Props> {
    private unmounted;
    private readonly timelineContainer;
    constructor(props: Props);
    render: () => JSX.Element;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
}
export default TwitterTimelineEmbed;
