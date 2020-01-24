import { Task } from "~/Util/fp/Instances/Task";
import { Option, tryCatch } from "~/Util/fp/Instances/Option";
import { optHead, optFind } from "~/Util/fp/array";
import { getEntity } from "~/Util/apiUtils";
import { CurrentUserSettings } from "~/Data/User/UserInterfaces";
import { getCurrentUserSettings } from "~/Data/User/userData";
import { GetEntityOptions } from "~/Data/DataInterfaces";
import { ITeam } from "~/Data/NudgeInterfaces";
import { NudgeUris } from "~/Uris/NudgeUris";
import { Pair } from "~/Util/fp/Instances/Pair";
import { optProp, propOr } from "~/Util/fp/object";
import { alphaCompareByDir } from "~/Util/sortUtils";
import { Compare } from "~/Util/fp/Instances/Compare";

const getReportingTeams = (getEntityOptions: GetEntityOptions) =>
    getEntity(
        NudgeUris.v2.teams()._uri,
        { q: "companyAccount.status:active AND (NOT type:personalTeam)", fields: "uri,teamName" },
        getEntityOptions
    )
        .map((teams: ITeam[] = []) => teams.sort(
            Compare.of(alphaCompareByDir(false))
                .contramap(propOr("type", ""))
                .concat(Compare.of(alphaCompareByDir(true))
                    .contramap(propOr("teamName", "")))
                .run));

interface TeamDisplay {
    uri: string;
    teamName: string;
}


const allTeamsUri: TeamDisplay = { uri: "/v2/users/current/teammates", teamName: "All Teams" };
const allCollabsUri: TeamDisplay = { uri: "/v2/userConnections", teamName: "All collaborators" };
const allTeamsAndCollabsUri: TeamDisplay = { uri: "/v2/users/current/collaborators", teamName: "You & Collaborators" };

export const aggregateTeamUris = {
    allTeamsUri,
    allCollabsUri,
    allTeamsAndCollabsUri,
};

export const getTeamsAndSelectedTeam = (userSettingsKey: keyof CurrentUserSettings, defaultTeamUri = "", getEntityOptions: GetEntityOptions) =>
    Task.of((userSettings: CurrentUserSettings) => (teams: ITeam[]) => Pair.of(userSettings, teams))
        .ap(getCurrentUserSettings({ fields: userSettingsKey }))
        .ap(getReportingTeams(getEntityOptions))
        .map(settingsTeams => settingsTeams
            .map((teams = []) => teams.map(({ uri = "", teamName = "" }) => ({ uri, teamName })))
            .merge((userSettings, teams) => ({
                selectedTeam: tryCatch(() => userSettings[userSettingsKey])
                    .chain(optProp("teamUri"))
                    .chain((userSettingsTeamUri: string) => optFind<TeamDisplay>(team => team.uri === userSettingsTeamUri)(teams) as unknown as Option<TeamDisplay>)
                    .chain(optProp("uri"))
                    .getOrElse(() => defaultTeamUri ? defaultTeamUri : optHead(teams)
                        .chain(optProp("uri"))
                        .getOrElse(() => "")),
                userSettings,
                teams,
            })));
