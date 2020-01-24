import { LogArgumentResolver } from "../LoggingInterfaces";
export default class FunctionArgumentResolver implements LogArgumentResolver {
    resolve(args: any[]): any[];
}
