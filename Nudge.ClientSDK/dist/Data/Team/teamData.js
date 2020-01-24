import { Task } from "../../Util/fp/Instances/Task";
import { tryCatch } from "../../Util/fp/Instances/Option";
import { optHead, optFind } from "../../Util/fp/array";
import { getEntity } from "../../Util/apiUtils";
import { getCurrentUserSettings } from "../User/userData";
import { NudgeUris } from "../../Uris/NudgeUris";
import { Pair } from "../../Util/fp/Instances/Pair";
import { optProp, propOr } from "../../Util/fp/object";
import { alphaCompareByDir } from "../../Util/sortUtils";
import { Compare } from "../../Util/fp/Instances/Compare";
var getReportingTeams = function (getEntityOptions) {
    return getEntity(NudgeUris.v2.teams()._uri, { q: "companyAccount.status:active AND (NOT type:personalTeam)", fields: "uri,teamName" }, getEntityOptions)
        .map(function (teams) {
        if (teams === void 0) { teams = []; }
        return teams.sort(Compare.of(alphaCompareByDir(false))
            .contramap(propOr("type", ""))
            .concat(Compare.of(alphaCompareByDir(true))
            .contramap(propOr("teamName", "")))
            .run);
    });
};
var allTeamsUri = { uri: "/v2/users/current/teammates", teamName: "All Teams" };
var allCollabsUri = { uri: "/v2/userConnections", teamName: "All collaborators" };
var allTeamsAndCollabsUri = { uri: "/v2/users/current/collaborators", teamName: "You & Collaborators" };
export var aggregateTeamUris = {
    allTeamsUri: allTeamsUri,
    allCollabsUri: allCollabsUri,
    allTeamsAndCollabsUri: allTeamsAndCollabsUri,
};
export var getTeamsAndSelectedTeam = function (userSettingsKey, defaultTeamUri, getEntityOptions) {
    if (defaultTeamUri === void 0) { defaultTeamUri = ""; }
    return Task.of(function (userSettings) { return function (teams) { return Pair.of(userSettings, teams); }; })
        .ap(getCurrentUserSettings({ fields: userSettingsKey }))
        .ap(getReportingTeams(getEntityOptions))
        .map(function (settingsTeams) { return settingsTeams
        .map(function (teams) {
        if (teams === void 0) { teams = []; }
        return teams.map(function (_a) {
            var _b = _a.uri, uri = _b === void 0 ? "" : _b, _c = _a.teamName, teamName = _c === void 0 ? "" : _c;
            return ({ uri: uri, teamName: teamName });
        });
    })
        .merge(function (userSettings, teams) { return ({
        selectedTeam: tryCatch(function () { return userSettings[userSettingsKey]; })
            .chain(optProp("teamUri"))
            .chain(function (userSettingsTeamUri) { return optFind(function (team) { return team.uri === userSettingsTeamUri; })(teams); })
            .chain(optProp("uri"))
            .getOrElse(function () { return defaultTeamUri ? defaultTeamUri : optHead(teams)
            .chain(optProp("uri"))
            .getOrElse(function () { return ""; }); }),
        userSettings: userSettings,
        teams: teams,
    }); }); });
};
//# sourceMappingURL=teamData.js.map