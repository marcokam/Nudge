import withHeader from "./withHeader";
export default (function (trackingIdProducer) { return withHeader("x-nudge-tracking", trackingIdProducer); });
//# sourceMappingURL=withTrackingHeader.js.map