var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getEntity, patchEntity } from "../../Util/apiUtils";
import { option } from "../../Util/fp/Instances/Option";
import { NudgeUris } from "../../Uris/NudgeUris";
export var currentUserSettingsKeys = Object.freeze({
    conversationsDefaults: "conversationsDefaults",
    relationshipsDefaults: "relationshipsDefaults",
    orgChartDefaults: "orgChartDefaults",
});
export var getCurrentUserSettings = function (query) { return getEntity(NudgeUris.v2.users().current().settings, query)
    .map(function (userSettings) {
    if (userSettings === void 0) { userSettings = {}; }
    return userSettings;
}); };
export var updateCurrentUserSettings = function (settings) { return patchEntity(__assign({ uri: NudgeUris.v2.users().current().settings }, settings)); };
export var getCurrentUser = function () {
    return option.of(Nudge).map(function (n) { return n.userDetailData; });
};
export var getLicenses = function (f) { return getCurrentUser()
    .chain(function (userDetailData) { return option.of(userDetailData.licenses); })
    .map(function (licenses) {
    if (licenses === void 0) { licenses = []; }
    return licenses.filter(f);
}); };
export var getValidLicenses = function () { return getLicenses(function (l) { return ["active", "cancellationPending"].includes(l.licenseStatus); }); };
export var hasValidLicenses = function () { return getValidLicenses().map(function (licenses) { return licenses.length > 0; }); };
//# sourceMappingURL=userData.js.map