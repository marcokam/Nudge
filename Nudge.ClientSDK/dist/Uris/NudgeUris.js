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
import { uriToId } from "./uriUtils";
// helpers
var buildUri = function (path) { return "/" + path.join("/"); };
var buildInstance = function (instances) { return function (basePath, uri) {
    var instancePath = uri ? basePath.concat(uriToId(uri).getOrElse("")).filter(Boolean) : basePath;
    return __assign({ _uri: buildUri(basePath), _instanceUri: buildUri(instancePath), _byUri: function (instanceUri) { return buildUri(basePath.concat(uriToId(instanceUri).getOrElse("")).filter(Boolean)); }, _byId: function (instanceId) { return buildUri(basePath.concat(String(instanceId)).filter(Boolean)); } }, instances(basePath, instancePath));
}; };
// instances
var listUris = buildInstance(function (basePath, instancePath) { return ({
    networks: {
        collaborators: buildUri(instancePath.concat("networks", "collaborators")),
        members: buildUri(instancePath.concat("networks", "members"))
    },
}); });
var peopleUris = buildInstance(function (basePath, instancePath) { return ({
    count: buildUri(basePath.concat("count")),
    exports: buildUri(basePath.concat("exports")),
    tweets: buildUri(instancePath.concat("lists")),
    mentions: buildUri(instancePath.concat("mentions")),
    lastCommunications: buildUri(instancePath.concat("lastCommunications")),
    notes: buildUri(instancePath.concat("notes")),
    experience: buildUri(instancePath.concat("experience")),
    lists: function (listUri) {
        return listUris(basePath.concat("lists"), listUri);
    },
}); });
var companiesUris = buildInstance(function (basePath, instancePath) { return ({
    count: buildUri(basePath.concat("count")),
    networks: {
        collaborators: buildUri(instancePath.concat("networks", "collaborators")),
        members: buildUri(instancePath.concat("networks", "members"))
    },
    lists: function (listUri) {
        return listUris(basePath.concat("lists"), listUri);
    },
}); });
var currentUserUris = buildInstance(function (basePath) { return ({
    settings: buildUri(basePath.concat("settings")),
    access: buildUri(basePath.concat("access")),
    activities: function (week) {
        if (week === void 0) { week = 0; }
        return buildUri(basePath.concat("activities", String(week)));
    },
}); });
var userUris = buildInstance(function (basePath) { return ({
    current: function () {
        return currentUserUris(basePath.concat("current"));
    },
    integrationDetails: buildUri(basePath.concat("integrationDetails")),
}); });
var teamUris = buildInstance(function () { return ({}); });
var userWeeklyActivityUris = buildInstance(function () { return ({}); });
var userLeaderboardUris = buildInstance(function () { return ({}); });
var userNetworkViewUris = buildInstance(function () { return ({}); });
var userRelationshipViewUris = buildInstance(function () { return ({}); });
var CompanyAccounts = buildInstance(function (basePath) { return ({
    myadmin: buildUri(basePath.concat("myadmin")),
}); });
var userFlaggedDatasUri = buildInstance(function (basePath) { return ({
    currentUser: buildUri(basePath.concat("currentUser")),
}); });
// main
export var NudgeUris = ({
    api: {
        aggregateAnalysis: {
            RunWeeklyActivity: function (userUri) {
                return userWeeklyActivityUris(["api", "aggregateAnalysis", "RunWeeklyActivity"], userUri);
            },
            RunUserLeaderboard: function (userUri) {
                return userLeaderboardUris(["api", "aggregateAnalysis", "RunUserLeaderboard"], userUri);
            },
            RunNetworkView: function (userUri) {
                return userNetworkViewUris(["api", "aggregateAnalysis", "RunNetworkView"], userUri);
            },
            RunRelationshipView: function (userUri) {
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
        userFlaggedDatas: function () {
            return userFlaggedDatasUri(["v2", "userFlaggedDatas"]);
        },
        people: function (personUri) {
            return peopleUris(["v2", "people"], personUri);
        },
        companies: function (companyUri) {
            return companiesUris(["v2", "companies"], companyUri);
        },
        users: function (userUri) {
            return userUris(["v2", "users"], userUri);
        },
        teams: function (teamUri) {
            return teamUris(["v2", "teams"], teamUri);
        },
        CompanyAccounts: function (companyAccountUri) {
            return CompanyAccounts(["v2", "CompanyAccounts"], companyAccountUri);
        },
    }
});
//# sourceMappingURL=NudgeUris.js.map