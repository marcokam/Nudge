import Producer from "~/Util/fp/Instances/Producer";
import withHeader from "./withHeader";

export default (trackingIdProducer: Producer<string>) => withHeader("x-nudge-tracking", trackingIdProducer);