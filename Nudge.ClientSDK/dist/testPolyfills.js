import registry from "./Util/registry";
import ComposableLogger from "./Logging/ComposableLogger";
import ConsoleAppender from "./Logging/Appenders/ConsoleAppender";
import FunctionArgumentResolver from "./Logging/ArgumentResolvers/FunctionArgumentResolver";
import { Task } from "./Util/fp/Instances/Task";
// fetch() polyfill for making API calls.
var fetchPoly = require("whatwg-fetch");
global["Headers"] = fetchPoly.Headers;
registry.logger = new ComposableLogger(new ConsoleAppender(console), new FunctionArgumentResolver());
registry.applicationServicesBaseUrl = Task.of("testBaseUrl");
//# sourceMappingURL=testPolyfills.js.map