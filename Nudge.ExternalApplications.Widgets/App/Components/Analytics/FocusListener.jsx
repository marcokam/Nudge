/**
 * Track events when the app window gains and loses focus
 * 
 * We want to model user engagement by seeing how long they are in the app.
 * 
 * To do this, we rely on browser events and properties to detect the start
 *   and end of a session, and also try to determine if the user is truly
 *   engaged in tha app.
 * 
 * The events and properties that can help us are:
 *      - visibilitychange          (event on document)
 *      - visibilityState           (property on document)
 * 
 *      - focus                     (event on window)
 *      - blur                      (event on window)
 *      - onbeforeunload            (event on window)
 * 
 * Visibilitychange fires when the tab contents has become visible or has been hidden
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
 * 
 * It would be sufficient to only rely on this event except that it does not change if
 *   the tab is visible, but is not focused.  This happens when the tab is the currently
 *   opened tab in the browser window, but the user is currently focused on some other
 *   application.
 * 
 * The property to check when this event fires is `document.visibilityState`.  We care if this
 *   property is `visible`, meaning our tab's contents are now visible.
 * 
 * In order to determine if the user is truly using the current tab when it is visible, we also use
 *   the `focus` and `blur` events on the window.
 * 
 * When `focus` fires, we know that the user is in our tab and most likely doing something.
 * 
 * When `blur` fires, this can happen if the user
 *   1. focuses on another application
 *   2. goes to or opens another tab
 *   3. minimizes the browser
 * 
 * In these cases, we combine this with `document.visibilityState` to know if the tab contents are
 *   currently visible.
 * 
 * Lastly, we want to try to to track when the user closes the browser, so that we can potentially see
 *   how long users are using our app.  To do this, we use the `onbeforeunload` event, which fires just before
 *   the window is unloaded.  It looks like this event does not always get fired, as the browser tries to
 *   close the window or unload the document as soon as possible.
 * 
 * Using these browser events and properties, we try to model user engagement by tracking 4 states:
 *   1. focused     - tab focused
 *                      We assume the user is actively engaged
 *   2. visible     - tab is current tab in browser, browser is not minimized, user focused somewhere else
 *                      We can't determine if the browser window is visible beside another application,
 *                        or if another application is on top of the browser window.  This might be a
 *                        passive use case where users are looking at our app's data while focusing 
 *                        somewhere else.
 *   3. hidden      - tab is not current tab in browser, or browser is minimized
 *                      User is definitely not engaged here, but this could help us determine how long
 *                        users have our app opened, even if it is not the tab they are using.
 *   4. closed      - tab is closed, this is the end of the session
 *                      Although this might be unreliable, it could help us determine duration of activity.
 */

import { useState, useEffect, useContext, useMemo } from "react";
import { debounce } from "lodash";
import { AnalyticsContext, EventNames } from "~/App/Context/AnalyticsContext.js";   

const states = {
    focused: "focused",
    visible: "visible",
    hidden: "hidden",
    closed: "closed",
};

export default function FocusListener() {
    const analyticsContext = useContext(AnalyticsContext);
    const trackActivity = useMemo(() => state => {
        analyticsContext.track(EventNames.UserEngagement, {
            properties: {
                window: state,
            }
        });
    }, [analyticsContext]);

    const [state, setState] = useState(states.focused);
    const dbSetState = useMemo(() => debounce(setState, 100), []);

    useEffect(() => {
        const visibilityListener = () => {
            if (document.visibilityState === "visible") {
                dbSetState(states.visible);
            } else {
                dbSetState(states.hidden);
            }
        };

        visibilityListener();
        document.addEventListener("visibilitychange", visibilityListener);

        return () => {
            document.removeEventListener("visibilitychange", visibilityListener);
        };
    }, [dbSetState]);

    useEffect(() => {
        const focusListener = () => dbSetState(states.focused);
        window.addEventListener("focus", focusListener);
        return () => window.removeEventListener("focus", focusListener);
    }, [dbSetState]);

    useEffect(() => {
        const blurListener = () => dbSetState(states.visible);
        window.addEventListener("blur", blurListener);
        return () => window.removeEventListener("blur", blurListener);
    }, [dbSetState]);

    useEffect(() => {
        const lastCall = () => trackActivity(states.closed);
        window.addEventListener("beforeunload", lastCall);
        return () => window.removeEventListener("beforeunload", lastCall);
    }, [trackActivity]);

    useEffect(() => {
        trackActivity(state);
    }, [state, trackActivity]);

    return null;
}
