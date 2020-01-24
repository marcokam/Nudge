import React, { Component } from "react";
import PropTypes from "prop-types";

import { nameToInitials } from "@nudge/client-sdk/Util/nameUtils";

import UIImage from "~/App/Components/UI/Image/UIImage.jsx";
import UIProfileInitials from "~/App/Components/UI/Profile/Initials/UIProfileInitials.jsx";


class ProfileImage extends Component {
    static displayName = "ProfileImage";
    static propTypes = {
        uid: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        title: PropTypes.string,
        className: PropTypes.string,
        size: PropTypes.number,
    };
    static defaultProps = {
        size: 30,
    };
    static getDerivedStateFromProps(props, state) {
        if (props.src !== state.src) {
            return { error: false };
        }
        return null;
    }

    state = {
        loaded: false,
        error: false,
    };

    render() {
        const { uid, src, alt, className, size } = this.props;
        const title = this.props.title || alt;
        const { error } = this.state;
        return error ? (
            <UIProfileInitials
                uid={uid}
                title={title}
                className={className}
                initials={nameToInitials(alt)}
                size={size}
            />
        ) : (
            <UIImage
                src={src}
                alt={alt}
                title={title}
                className={className}
                size={size}
                onLoad={this.onload}
                onError={this.onerror}
            />
        );
    }

    onload = () => {
        const { src } = this.props;
        this.setState({ src, loaded: true, error: false });
    };
    onerror = () => {
        const { src } = this.props;
        this.setState({ src, error: true });
    };
}

export default ProfileImage;
