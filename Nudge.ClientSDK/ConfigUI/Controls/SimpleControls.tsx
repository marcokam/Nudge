// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

import { 
    ControlInstanceFactory,
    ControlInstanceFactorySettings
} from "../ConfigUIInterfaces";
import { sfcFactory } from "../Helpers";

export const Heading: ControlInstanceFactory = sfcFactory(
    (settings: ControlInstanceFactorySettings) =>
        () => <div className="headingRow"><div className="heading">{ settings.controlConfiguration.parameters.text }</div></div>
);
//TODO: Allow styling?  Italics/small text
export const Text: ControlInstanceFactory = sfcFactory(
    (settings: ControlInstanceFactorySettings) => {
        const { text, className } = settings.controlConfiguration.parameters
        return () => <div className={className}>{text}</div>;
    }
);