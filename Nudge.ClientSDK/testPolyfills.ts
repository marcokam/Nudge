import registry from "./Util/registry";
import ComposableLogger from "./Logging/ComposableLogger";
import ConsoleAppender from "./Logging/Appenders/ConsoleAppender";
import FunctionArgumentResolver from "./Logging/ArgumentResolvers/FunctionArgumentResolver";
import { Task } from "./Util/fp/Instances/Task";


// fetch() polyfill for making API calls.
const fetchPoly = require("whatwg-fetch");
(global as any)["Headers" as any as number] = fetchPoly.Headers as Headers;

registry.logger = new ComposableLogger(new ConsoleAppender(console), new FunctionArgumentResolver());
registry.applicationServicesBaseUrl = Task.of("testBaseUrl");