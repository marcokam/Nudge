var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { postEntity, getEntity } from "../../../Util/apiUtils";
import { NudgeUris } from "../../../Uris/NudgeUris";
import { option } from "../../../Util/fp/Instances/Option";
import { List } from "../../../Util/fp/Instances/List";
var FlaggedDataTypeEnum;
(function (FlaggedDataTypeEnum) {
    FlaggedDataTypeEnum["personName"] = "personName";
    FlaggedDataTypeEnum["personDuplicate"] = "personDuplicate";
    FlaggedDataTypeEnum["personImage"] = "personImage";
    FlaggedDataTypeEnum["personBadMerge"] = "personBadMerge";
    FlaggedDataTypeEnum["personBadData"] = "personBadData";
})(FlaggedDataTypeEnum || (FlaggedDataTypeEnum = {}));
export var flaggedDataReason = {
    none: "",
    cancelled: "cancelled",
    general: "general",
    incorrectCompany: "incorrectCompany",
    incorrectTitle: "incorrectTitle",
};
var flagData = function (flaggedData) { return postEntity(NudgeUris.v2.userFlaggedDatas()._uri, flaggedData); };
var flagPersonBadData = function (personUri, note) { return flagData({
    person1: { uri: personUri },
    note: note,
    type: FlaggedDataTypeEnum.personBadData,
}); };
var generateNote = function (prefix, reason) {
    if (prefix === void 0) { prefix = ""; }
    if (reason === void 0) { reason = flaggedDataReason.none; }
    return [prefix, reason].filter(Boolean).join(" ");
};
export var getPrefixAndReason = function (note) {
    if (note === void 0) { note = ""; }
    return option.of(note)
        .map(function (n) { return List.fromArray(n.split("\n"))
        .map(function (l) { return l.split(" "); }); })
        .chain(function (l) { return l.optLast()
        .map(function (_a) {
        var _b = __read(_a, 2), _c = _b[0], prefix = _c === void 0 ? "" : _c, reason = _b[1];
        return ({ prefix: prefix, reason: reason });
    }); })
        .getOrElse(function () { return ({ prefix: "", reason: flaggedDataReason.none }); });
};
export var getCurrentFlaggedData = function () { return getEntity(NudgeUris.v2.userFlaggedDatas().currentUser, { q: "type:" + FlaggedDataTypeEnum.personBadData }); };
export var flagProfileWithPrefixAndReason = function (prefix, reason) {
    if (prefix === void 0) { prefix = ""; }
    if (reason === void 0) { reason = ""; }
    return function (personUri) { return flagPersonBadData(personUri, generateNote(prefix, reason)); };
};
//# sourceMappingURL=flagData.js.map