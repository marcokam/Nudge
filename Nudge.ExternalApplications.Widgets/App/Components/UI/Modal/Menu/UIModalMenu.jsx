import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Transition, animated } from "react-spring/renderprops";

const config = { tension: 250, friction: 30 };
const startTransform = { transform: "translateY(100%)", opacity: 0 };
const endTransform = { transform: "translateY(0)", opacity: 1 };


export default class UIModalMenu extends Component {
    static defaultProps = {
        nodeId: "uiModalMenu",
        show: false,
        title: null,
        options: [],
        selectHandler: () => {},
        cancelHandler: () => {},
    };

    constructor(props) {
        super(props);
        this.el = document.querySelector(`#${props.nodeId}`);
        if (!this.el) {
            this.el = document.createElement("div");
            this.el.id = props.nodeId;
            document.body.append(this.el);
        }
    }

    render() {
        const { show, title, options, selectHandler, cancelHandler } = this.props;
        const children = (
            <Transition
                native
                config={config}
                items={show}
                from={startTransform}
                enter={endTransform}
                leave={startTransform}
            >
                {show =>
                    show &&
                    function ActionMenu(props) {
                        return (
                            <animated.div
                                className="fixed absolute--fill z-999 bg-black-40 flex flex-column justify-center items-center"
                                style={{ opacity: props.opacity }}
                                onClick={event => {
                                    if (event.target === event.currentTarget) {
                                        cancelHandler();
                                    }
                                }}
                            >
                                <animated.div className="relative bg-white shadow-4 br2" style={{ minWidth: 400, top: "-20%", ...props }}>
                                    <section>{title}</section>
                                    <ul className="list ph0 mv0 f5">
                                        {Object.values(options).map((suboptions) => (
                                            suboptions.map((option, suboptionIndex) => (
                                                <li
                                                    className={`mv0 pa3 bt ${suboptionIndex === 0 ? "b--black-20" : "b--black-05"}`}
                                                    key={`suboption_${suboptionIndex}`}
                                                    onClick={event => selectHandler(event, suboptionIndex)}
                                                >
                                                    {option}
                                                </li>
                                            ))  
                                        ))}
                                    </ul>
                                </animated.div>
                            </animated.div>
                        );
                    }
                }
            </Transition>
        );
        return ReactDOM.createPortal(children, this.el);
    }
}
