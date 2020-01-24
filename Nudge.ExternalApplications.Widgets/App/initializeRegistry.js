import registry from "@nudge/client-sdk/Util/registry";
import { Task } from "@nudge/client-sdk/Util/fp/Instances/Task.js";
import appConfig from "./appConfig.js";

// Auth
import { getOrCreateTokenManager } from "./authorization.js";

// API
import DefaultApiClient from "@nudge/client-sdk/Api/DefaultApiClient";
import fetchInvoker from "@nudge/client-sdk/Api/fetchInvoker";
import { addMultipleMiddleware } from "@nudge/client-sdk/Api/Factories";
import noCacheHeaders from "@nudge/client-sdk/Api/RequestTransformers/noCacheHeaders";
import jsonHeaders from "@nudge/client-sdk/Api/RequestTransformers/jsonHeaders";
import throwOnError from "@nudge/client-sdk/Api/RequestTransformers/throwOnError";
import withBearerToken from "@nudge/client-sdk/Api/RequestTransformers/withBearerToken";
import withAutoRefreshToken from "@nudge/client-sdk/Api/Middleware/withAutoRefreshToken";
import withBaseAddress from "@nudge/client-sdk/Api/RequestTransformers/withBaseAddress";
import { trackingId } from "~/App/Utils/singletons.js";
import timeoutAbortSignal from "@nudge/client-sdk/Api/Middleware/timeoutAbortSignal";
import withTrackingHeader from "@nudge/client-sdk/Api/RequestTransformers/withTrackingHeader";
import withCorrelationType from "@nudge/client-sdk/Api/RequestTransformers/withCorrelationType";

// Logger
import BufferedLogger from "@nudge/client-sdk/Logging/BufferedLogger";
import { setupStandardLogger } from "@nudge/client-sdk/Logging/LoggerInitialization";

const initializeRegistry = () => {

    // Setup buffered logger to use while we setup other things
    const bufferedLogger = new BufferedLogger();
    registry.logger = bufferedLogger;

    // Setup the ApiClient.
    const tokenManager = getOrCreateTokenManager();
    const invoker = addMultipleMiddleware(fetchInvoker, [
        throwOnError(),
        withAutoRefreshToken(tokenManager, bufferedLogger),
        withCorrelationType("mobileui"),
        withTrackingHeader(() => trackingId),
        withBaseAddress(Nudge.urls.applicationServices),
        withBearerToken(),        
        jsonHeaders(),
        noCacheHeaders(),
        timeoutAbortSignal(appConfig.api.defaultTimeout),
    ]);
    registry.apiClient = new DefaultApiClient(invoker);
    
    // Setup logger
    setupStandardLogger(bufferedLogger, Nudge.urls.securityManagement, appConfig.logger);

    // Setup variables
    registry.baseUrl = Task.of(`${document.location.protocol}//${document.location.host}`);
    registry.applicationServicesBaseUrl = Task.of(Nudge.urls.applicationServices);
    registry.webappBaseUrl = Task.of(Nudge.urls.webApp);
    registry.applicationServiceCdnURL = Task.of(Nudge.urls.applicationServicesCdn);
};
export default initializeRegistry;
