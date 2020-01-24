import React, { Component, Fragment } from "react";

import NudgeIcon from "~/App/Components/Icons/Nudge/NudgeIcon.jsx";
import ExternalLink from "~/App/Components/Navigation/Link/External/ExternalLink.jsx";

export default class AppMenu extends Component {
    static defaultProps = {
        nodeId: "appMenu",
    };

    state = { show: false };

    render() {
        const { showHeader = false } = this.props;
        const containerStyles = showHeader ? { height: 40 } : null;

        return (
            <Fragment>
                {showHeader && (
                    <div style={containerStyles} className="fixed w-100 z-999 flex items-center ph3 bg-nudge-blue white bb b--black-10">
                        <ExternalLink href="https://nudge.ai" className="link color-inherit flex items-center f6 fw4">
                            <span className="flex items-center mr3"><NudgeIcon className="h1 w1 mr1" />Nudge</span>
                            <span className="flex items-center o-50">Relationship Intelligence</span>
                        </ExternalLink>
                    </div>
                )}
            </Fragment>
        );
    }
}