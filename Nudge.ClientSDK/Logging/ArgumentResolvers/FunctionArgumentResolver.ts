import { LogArgumentResolver } from "../LoggingInterfaces";
import { resolveFunction } from "~/Util/utils";

export default class FunctionArgumentResolver implements LogArgumentResolver {
    resolve(args: any[]): any[] {
        return args == null
            ? []
            : args.map(resolveFunction);
    }
}