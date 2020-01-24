import NudgeIterable from "./NudgeIterable";
import { forEach } from "./IterableUtils";
var vanillaEntriesToObject = function (entries) {
    var result = {};
    forEach(entries, function (entry) {
        var key = entry[0];
        var value = entry[1];
        result[key] = value;
    });
    return result;
};
// lib.dom.d.ts does not include URLSearchParams.entries()
// We will force compiler to accept it here.
var urlSearchParamsEntries = function (urlSearchParams) { return urlSearchParams.entries(); };
export var entries = function (obj) { return NudgeIterable.fromArray(Object.keys(obj)).map(function (key) { return ({ key: key, value: obj[key] }); }); };
export var fromQuery = function (search) { return vanillaEntriesToObject(urlSearchParamsEntries(new URLSearchParams(search))); };
export var toQuery = function (params) { return !params ? "" : Object.keys(params).map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]); }).join('&'); };
export var isEmptyObject = function (obj) { return Object.keys(obj).length === 0 && obj.constructor === Object; };
//# sourceMappingURL=ObjectUtils.js.map