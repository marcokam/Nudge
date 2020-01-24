import { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { AnalyticsContext } from "~/App/Context/AnalyticsContext.js";

function AnalyticsListener({ history, location }) {
    const [prevLocation, updateLocation] = useState(null);
    const analyticsContext = useContext(AnalyticsContext);

    useEffect(() => {
        const trackPage = function(location) {
            const navParams = queryString.parse(location.search);
            const pageID = (location.pathname || "").split("/").filter(i => i)[0];
                
            if (location !== prevLocation) {
                analyticsContext.track("Page", {
                    url: location ? `${location.pathname}${location.search}` : "",
                    referrer: prevLocation ? `${prevLocation.pathname}${prevLocation.search}` : "",
                    properties: {
                        pageID,
                        ...navParams
                    }
                });
                
                updateLocation(location);
            }
        };
        trackPage(location);

        return history.listen(trackPage);
    }, [history, location, analyticsContext, prevLocation]);

    return null;
}

export default withRouter(AnalyticsListener);