import { uriToId } from "./uriUtils";

// types
type Uri = string;
type Path = string[];

// helpers
const buildUri = (path: Path): Uri => `/${path.join("/")}`;
const buildInstance = <I>(instances: (basePath: Path, instancePath: Path) => I) => (basePath: Path, uri?: Uri) => {
    const instancePath = uri ? basePath.concat(uriToId(uri).getOrElse("")).filter(Boolean) : basePath;
    return {
        _uri: buildUri(basePath),
        _instanceUri: buildUri(instancePath),
        _byUri: (instanceUri: string) => buildUri(basePath.concat(uriToId(instanceUri).getOrElse("")).filter(Boolean)),
        _byId: (instanceId: number) => buildUri(basePath.concat(String(instanceId)).filter(Boolean)),
        ...instances(basePath, instancePath),
    }
}

// instances
const listUris = buildInstance((basePath, instancePath) => ({
    networks: {
        collaborators: buildUri(instancePath.concat("networks", "collaborators")),
        members: buildUri(instancePath.concat("networks", "members"))
    },
}));
const peopleUris = buildInstance((basePath, instancePath) => ({
    count: buildUri(basePath.concat("count")),
    exports: buildUri(basePath.concat("exports")),
    tweets: buildUri(instancePath.concat("lists")),
    mentions: buildUri(instancePath.concat("mentions")),
    lastCommunications: buildUri(instancePath.concat("lastCommunications")),
    notes: buildUri(instancePath.concat("notes")),
    experience: buildUri(instancePath.concat("experience")),
    lists(listUri?: Uri) {
        return listUris(basePath.concat("lists"), listUri);
    },
}));
const companiesUris = buildInstance((basePath, instancePath) => ({
    count: buildUri(basePath.concat("count")),
    networks: {
        collaborators: buildUri(instancePath.concat("networks", "collaborators")),
        members: buildUri(instancePath.concat("networks", "members"))
    },
    lists(listUri?: Uri) {
        return listUris(basePath.concat("lists"), listUri);
    },
}));
const currentUserUris = buildInstance((basePath) => ({
    settings: buildUri(basePath.concat("settings")),
    access: buildUri(basePath.concat("access")),
    activities(week: number = 0) {
        return buildUri(basePath.concat("activities", String(week)));
    },
}));
const userUris = buildInstance((basePath) => ({
    current() {
        return currentUserUris(basePath.concat("current"));
    },
    integrationDetails: buildUri(basePath.concat("integrationDetails")),
}));
const teamUris = buildInstance(() => ({}));
const userWeeklyActivityUris = buildInstance(() => ({}));
const userLeaderboardUris = buildInstance(() => ({}));
const userNetworkViewUris = buildInstance(() => ({}));
const userRelationshipViewUris = buildInstance(() => ({}));
const CompanyAccounts = buildInstance(basePath => ({
    myadmin: buildUri(basePath.concat("myadmin")),
}));
const userFlaggedDatasUri = buildInstance(basePath => ({
    currentUser: buildUri(basePath.concat("currentUser")),
}));


// main
export const NudgeUris = ({
    api: {
        aggregateAnalysis: {
            RunWeeklyActivity(userUri?: Uri) {
                return userWeeklyActivityUris(["api", "aggregateAnalysis", "RunWeeklyActivity"], userUri);
            },
            RunUserLeaderboard(userUri?: Uri) {
                return userLeaderboardUris(["api", "aggregateAnalysis", "RunUserLeaderboard"], userUri);
            },
            RunNetworkView(userUri?: Uri) {
                return userNetworkViewUris(["api", "aggregateAnalysis", "RunNetworkView"], userUri);
            },
            RunRelationshipView(userUri?: Uri) {
                return userRelationshipViewUris(["api", "aggregateAnalysis", "RunRelationshipView"], userUri);
            },
        },
        v1: {
            Tokens: {
                external: buildUri(["api", "v1", "Tokens", "external"]),
            },
        }
    },
    v1: {
        Features: {
            Available: buildUri(["v1", "Features", "Available"]),
        },
    },
    v2: {
        userFlaggedDatas() {
            return userFlaggedDatasUri(["v2", "userFlaggedDatas"]);
        },
        people(personUri?: Uri) {
            return peopleUris(["v2", "people"], personUri);
        },
        companies(companyUri?: Uri) {
            return companiesUris(["v2", "companies"], companyUri);
        },
        users(userUri?: Uri) {
            return userUris(["v2", "users"], userUri)
        },
        teams(teamUri?: Uri) {
            return teamUris(["v2", "teams"], teamUri);
        },
        CompanyAccounts(companyAccountUri?: Uri) {
            return CompanyAccounts(["v2", "CompanyAccounts"], companyAccountUri);
        },
    }
});
