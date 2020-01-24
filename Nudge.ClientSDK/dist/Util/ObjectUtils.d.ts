import NudgeIterable from "./NudgeIterable";
import KeyValuePair from "./KeyValuePair";
export declare const entries: (obj: any) => NudgeIterable<KeyValuePair<string, any>>;
export declare const fromQuery: (search: string) => Record<string, any>;
export declare const toQuery: (params?: Record<string, any> | undefined) => string;
export declare const isEmptyObject: (obj: any) => boolean;
