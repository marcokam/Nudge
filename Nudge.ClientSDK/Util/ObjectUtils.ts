import NudgeIterable from "./NudgeIterable";
import KeyValuePair from "./KeyValuePair";
import { forEach } from "./IterableUtils";

const vanillaEntriesToObject = (entries: Iterable<any[]>) => {
    const result: Record<string, any> = {};
    forEach(entries, entry => {
        const key = entry[0] as string;
        const value = entry[1];
        result[key] = value;
    });
    return result;
}

// lib.dom.d.ts does not include URLSearchParams.entries()
// We will force compiler to accept it here.
const urlSearchParamsEntries = (urlSearchParams: URLSearchParams) => (urlSearchParams as any).entries() as Iterable<any[]>;

export const entries = (obj: any): NudgeIterable<KeyValuePair<string, any>> => NudgeIterable.fromArray(Object.keys(obj)).map(key => ({ key, value: obj[key]}));
export const fromQuery = (search: string) => vanillaEntriesToObject(urlSearchParamsEntries(new URLSearchParams(search)));
export const toQuery = (params?: Record<string, any>) => !params ? "" : Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
export const isEmptyObject = (obj: any) => Object.keys(obj).length === 0 && obj.constructor === Object;