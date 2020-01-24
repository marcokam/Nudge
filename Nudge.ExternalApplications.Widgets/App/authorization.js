import uuid from "uuid";
import URLSearchParams from "url-search-params";

import WebAppTokenManager from "@nudge/client-sdk/Authentication/WebAppTokenManager";
import LazyValue from "@nudge/client-sdk/Util/LazyValue";

import logger from "~/App/Services/Logger.js";
import { trackingId } from "~/App/Utils/singletons.js";


// Windows that we have open
const loginWindows = {};

function setAccessToken(accessToken) {
    logger.info("Setting access token");
    logger.setAccessToken(accessToken);
}

function getAccessToken() {
    return getOrCreateTokenManager().getAccessToken();
}

function restoreState(searchParams) {    
    let state = searchParams.get("state") || "";
    if (!state) {
        return;
    }
    if (state && !state[0] === "/") {
        state = "/";
    }
    logger.info("Restoring state.", { state });
    const newUrl = window.location.origin + state;
    window.history.replaceState({}, "", newUrl);
}

function performRefresh() {
    return getOrCreateTokenManager().performRefresh();
}

function shouldRefreshAndRetry(responseStatusCode, responseBody) {
    //TODO: Allow e.code to be a string for when we eventually change the API contract                        
    return responseStatusCode === 401 
        && responseBody
        && Array.isArray(responseBody)
        && responseBody.filter(e => e.code === 401001).length > 0;
}

function init() { 
    setAccessToken(Nudge.auth.accessToken);
    restoreState(new URLSearchParams(location.search));

    // Listen for the login popup to tell us when its logged in
    window.addEventListener("message", event => {
        if (!event.origin === location.origin) {
            return;
        }

        if (!event.data || event.data.verb !== "FINISH_LOGIN") {
            return;
        }

        //TODO: We may want to wait for any in-flight refreshes to finish?
        //      There's a race condition here but probably will never actually be hit.
        getOrCreateTokenManager().performRefresh().then(() => {
            // Execute callback if found
            if (Nudge.startupCallback) {
                Nudge.startupCallback();
                Nudge.startupCallback = undefined;
            }

            // Find and close the popup window
            const state = event.data.state;
            if (!state) {
                return;
            }
            const urlParams = new URLSearchParams(state);
            const windowId = urlParams.get("windowId");

            if (!windowId) {
                return;
            }
            const loginWindow = loginWindows[windowId];
            if (!loginWindow) {
                return;
            }
            loginWindow.close(); 
        });
    }, false);
    
    // This was a temporary value.  Remove it so we don't get confused later.
    Nudge.auth.accessToken = undefined;
}

function startLogin(startupCallback) {
    Nudge.startupCallback = startupCallback;
    const windowId = uuid();
    const state = `windowId=${encodeURIComponent(windowId)}`;    
    const url = `${Nudge.auth.authorizeUrl}&state=${encodeURIComponent(state)}`;
    loginWindows[windowId] = window.open(url, 'nudge-sfdc-widgets-login', 'height=800,width=600');
}

export default { 
    init,
    getAccessToken,
    shouldRefreshAndRetry,
    performRefresh,
    startLogin
};

const initialExpirySeconds = new LazyValue(() => {
    const value = Nudge.auth.accessTokenExpiresInSeconds;    
    // This was a temporary value.  Remove it so we don't get confused later.  
    Nudge.auth.accessTokenExpiresInSeconds = undefined;
    return value;
});

const createTokenManager = () => {
    const settings = {
        startingAccessToken: Nudge.auth.accessToken,
        refreshUrl: "/widgets/OAuthRefresh",
        initialExpirySeconds: initialExpirySeconds.getValue(),
        isImpersonating: Nudge.auth.impersonating,
        userName: Nudge.auth.userName,
        onAccessTokenChange: setAccessToken,
        onRefreshFail: () => window.location.reload(),
        additionalHeaders: {
            "x-correlation-type": "mobileui",
            "x-nudge-tracking": trackingId,
        }
    };
    const tokenManager = new WebAppTokenManager(settings);
    setAccessToken(tokenManager.getAccessToken());
    return tokenManager;
};

export const getOrCreateTokenManager = new LazyValue(createTokenManager).getValue;
