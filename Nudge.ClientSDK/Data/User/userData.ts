import { getEntity, patchEntity } from "~/Util/apiUtils";
import { KeyMap, Query } from "~/Data/DataInterfaces";
import { option } from "~/Util/fp/Instances/Option";
import { NudgeUris } from "~/Uris/NudgeUris";

import { License, CurrentUserSettings } from "./UserInterfaces";


export const currentUserSettingsKeys: KeyMap<CurrentUserSettings> = Object.freeze({
    conversationsDefaults: "conversationsDefaults",
    relationshipsDefaults: "relationshipsDefaults",
    orgChartDefaults: "orgChartDefaults",  
});
export const getCurrentUserSettings = (query: Query) => getEntity(NudgeUris.v2.users().current().settings, query)
    .map((userSettings = {}) => userSettings);
export const updateCurrentUserSettings = (settings: CurrentUserSettings) => patchEntity({ uri: NudgeUris.v2.users().current().settings, ...settings });


export const getCurrentUser = () => {
    return option.of(Nudge).map((n: typeof Nudge) => n.userDetailData);
}

export const getLicenses = (f: (l: License) => boolean) => getCurrentUser()
    .chain(userDetailData => option.of(userDetailData.licenses))
    .map((licenses = []) => licenses.filter(f))
export const getValidLicenses = () => getLicenses(l => ["active", "cancellationPending"].includes(l.licenseStatus));
export const hasValidLicenses = () => getValidLicenses().map(licenses => licenses.length > 0);

