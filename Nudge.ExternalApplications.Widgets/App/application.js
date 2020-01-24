import React from "react";
import { render } from "react-dom";

import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { NudgeUris } from "@nudge/client-sdk/Uris/NudgeUris";
import { getEntity } from "@nudge/client-sdk/Util/apiUtils";

import { mapUserDetailData } from "~/App/Utils/userUtils.js";
import App from "~/App/Components/App.jsx";
import authorization from "./authorization.js";
import FeatureToggles from "~/App/FeatureToggles.js";
import initializeRegistry from "~/App/initializeRegistry.js";

/**
 * Setup currently authenticated user
 */
const setupUser = () => {
    if (!authorization.getAccessToken()) {
        return Promise.reject();
    }
    return getEntity(NudgeUris.v2.users().current()._uri).fork(
        err => logger.error(err),
        user => {
            Nudge.userDetailData = mapUserDetailData(user);
            return user;
        },
    );
};

const setupFeatureToggles = () => {
    return getEntity(NudgeUris.v1.Features.Available).fork(err => logger.error(err), data => FeatureToggles.init(data));
};

class Application {
    start() {
        initializeRegistry();
        authorization.init();

        // push starting route
        const url = Nudge.routePrefix + Nudge.route;
        history.replaceState(null, null, url);

        const initializedPromise = setupUser().then(setupFeatureToggles);
        const appContainer = document.querySelector(".widget");
        render(<App initializedPromise={initializedPromise} />, appContainer);
    }
}

export default Application;
