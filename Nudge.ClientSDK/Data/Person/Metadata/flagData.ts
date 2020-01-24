import { postEntity, getEntity } from "~/Util/apiUtils";
import { NudgeUris } from "~/Uris/NudgeUris";
import { option } from "~/Util/fp/Instances/Option";
import { List } from "~/Util/fp/Instances/List";



enum FlaggedDataTypeEnum {
    personName = "personName",
    personDuplicate = "personDuplicate",
    personImage = "personImage",
    personBadMerge = "personBadMerge",
    personBadData = "personBadData",
}
interface FlaggedDataPayload {
    person1?: { uri: string };
    note?: string;
    type: FlaggedDataTypeEnum;
}
export type FlaggedDataReason = "" | "cancelled" | "general" | "incorrectCompany" | "incorrectTitle";

export const flaggedDataReason: {
    none: FlaggedDataReason;
    cancelled: FlaggedDataReason;
    general: FlaggedDataReason;
    incorrectCompany: FlaggedDataReason;
    incorrectTitle: FlaggedDataReason;
} = {
    none: "",
    cancelled: "cancelled",
    general: "general",
    incorrectCompany: "incorrectCompany",
    incorrectTitle: "incorrectTitle",
}
const flagData = (flaggedData: FlaggedDataPayload) => postEntity(NudgeUris.v2.userFlaggedDatas()._uri, flaggedData);
const flagPersonBadData = (personUri: string, note: string) => flagData({
    person1: { uri: personUri },
    note,
    type: FlaggedDataTypeEnum.personBadData,
});
const generateNote = (prefix = "", reason = flaggedDataReason.none) =>
    [prefix, reason].filter(Boolean).join(" ");
export const getPrefixAndReason = (note = "") => option.of(note)
    .map(n => List.fromArray(n.split("\n"))
        .map(l => l.split(" ")))
    .chain(l => l.optLast()
        .map(([prefix = "", reason]) => ({ prefix, reason } as unknown as { prefix: string; reason: FlaggedDataReason })))
    .getOrElse(() => ({ prefix: "", reason: flaggedDataReason.none }));

export const getCurrentFlaggedData = () => getEntity(NudgeUris.v2.userFlaggedDatas().currentUser, { q: `type:${FlaggedDataTypeEnum.personBadData}` });
export const flagProfileWithPrefixAndReason = (prefix = "", reason: FlaggedDataReason = "") => (personUri: string) => flagPersonBadData(personUri, generateNote(prefix, reason));
