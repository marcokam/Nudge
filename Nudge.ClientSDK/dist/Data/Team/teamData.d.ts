import { Task } from "../../Util/fp/Instances/Task";
import { CurrentUserSettings } from "../User/UserInterfaces";
import { GetEntityOptions } from "../DataInterfaces";
interface TeamDisplay {
    uri: string;
    teamName: string;
}
export declare const aggregateTeamUris: {
    allTeamsUri: TeamDisplay;
    allCollabsUri: TeamDisplay;
    allTeamsAndCollabsUri: TeamDisplay;
};
export declare const getTeamsAndSelectedTeam: (userSettingsKey: "conversationsDefaults" | "relationshipsDefaults" | "orgChartDefaults", defaultTeamUri: string | undefined, getEntityOptions: GetEntityOptions) => Task<unknown, {
    selectedTeam: string;
    userSettings: CurrentUserSettings;
    teams: {
        uri: string;
        teamName: string;
    }[];
}>;
export {};
