import { useEffect, useState } from "react";
import { format } from "date-fns";

import { WeeklyActivity, Leaderboard, NetworkView, ContactActivity } from "~/Data/Report/ReportInterfaces";

import { apiStates, getEntity } from "~/Util/apiUtils";
import { NudgeUris } from "~/Uris/NudgeUris";
import * as logger from "~/Logging/DefaultLogger";

export function useWeeklyActivityReport(userUri: string) {
    const [weeklyActivityReport, setWeeklyActivityReport] = useState<Partial<WeeklyActivity> & { apiState: string }>({ apiState: apiStates.fetching });
    useEffect(() => {
        if (!userUri) return;
        let cancelled = false;
        if (!weeklyActivityReport.result) {
            getEntity(NudgeUris.api.aggregateAnalysis.RunWeeklyActivity(userUri)._instanceUri)
                .fork(err => {
                    if (cancelled) return;
                    setWeeklyActivityReport({
                        apiState: apiStates.error,
                    });
                    logger.error("Error getting weekly activity report", err);
                },
                (response = {}) => {
                    if (cancelled) return;
                    setWeeklyActivityReport({
                        apiState: apiStates.fetched,
                        ...response,
                    });
                });
        }
        return () => {
            cancelled = true;
        }
    }, [setWeeklyActivityReport, userUri, weeklyActivityReport.result]);

    return [weeklyActivityReport];
}

export function useLeaderboardReport(userUri: string) {
    const [leaderboardReport, setLeaderboardReport] = useState<Partial<Leaderboard> & { apiState: string }>({ apiState: apiStates.fetching });
    useEffect(() => {
        if (!userUri) return;
        let cancelled = false;
        if (!leaderboardReport.results) {
            getEntity(NudgeUris.api.aggregateAnalysis.RunUserLeaderboard(userUri)._instanceUri)
                .fork(err => {
                    if (cancelled) return;
                    setLeaderboardReport({
                        apiState: apiStates.error,
                    });
                    logger.error("Error getting leaderboard report", err);
                },
                (response = {}) => {
                    if (cancelled) return;
                    setLeaderboardReport({
                        apiState: apiStates.fetched,
                        ...response,
                    });
                });
        }
        return () => {
            (cancelled = true);
        }
    }, [leaderboardReport.results, setLeaderboardReport, userUri]);

    return [leaderboardReport];
}

export function useNetworkViewReport(userUri: string) {
    const [networkViewReport, setNetworkViewReport] = useState<Partial<NetworkView> & { apiState: string }>({ apiState: apiStates.fetching });
    useEffect(() => {
        if (!userUri) return;
        let cancelled = false;
        getEntity(NudgeUris.api.aggregateAnalysis.RunNetworkView(userUri)._instanceUri)
            .fork(err => {
                if (cancelled) return;
                setNetworkViewReport({
                    apiState: apiStates.error,
                });
                logger.error("Error getting network view report", err);
            },
            (response = {}) => {
                if (cancelled) return;
                setNetworkViewReport({
                    apiState: apiStates.fetched,
                    ...response,
                });
            });
        return () => {
            (cancelled = true);
        };
    }, [setNetworkViewReport, userUri]);

    return [networkViewReport];
}

export function useContactActivity(weeks = 0) {
    const [contactActivity, setContactActivity] = useState<{ apiState: string; newContacts: ContactActivity[]; allContacts: ContactActivity[]}>({
        apiState: apiStates.fetching,
        newContacts: [],
        allContacts: [],
    });
    useEffect(() => {
        let cancelled = false;
        getEntity(NudgeUris.v2.users().current().activities(weeks))
            .fork(err => {
                if (cancelled) return;
                setContactActivity({ apiState: apiStates.error, newContacts: [], allContacts: [] });
                logger.error("Error getting contact capture activity", err);
            },
            (response: ContactActivity[] = []) => {
                if (cancelled) return;
                setContactActivity({
                    apiState: apiStates.fetched,
                    newContacts: response.filter(({ identities }) => identities.some(i => i.isNew)),
                    allContacts: response,
                });
            });
        return () => {
            cancelled = true;
        };
    }, [weeks]);
    const generateCSVContent = () => {
        const csvHeader = "data:application/csv;charset=utf-8,";
        const headers = [
            "DisplayName",
            "JobTitle",
            "MainCompanyName",
            "City",
            "State",
            "Country",
            "EmailAddress1",
            "EmailAddress2",
            "EmailAddress3",
            "Twitter",
            "LinkedIn",
            "InboundEmails",
            "LastInboundEmailDate",
            "OutboundEmails",
            "LastOutboundEmailDate",
            "Meetings",
            "LastMeetingDate",
        ]
            .map(c => `"${c}"`)
            .join(",");

        return [csvHeader.concat(headers)]
            .concat(
                (contactActivity.allContacts || [])
                    .map(({ identities = [], ...restContact }) => ({
                        ...restContact,
                        emails: identities.filter(i => i.type === "email").map(i => i.identity),
                        twitters: identities.filter(i => i.type === "twitter").map(i => i.identity),
                        linkedIns: identities.filter(i => i.type === "linkedIn").map(i => i.identity),
                    }))
                    .map(
                        ({
                            name = "",
                            title = "",
                            company,
                            city = "",
                            state = "",
                            country = "",
                            emails: [emailAddress1 = "", emailAddress2 = "", emailAddress3 = ""] = [],
                            twitters: [twitter = ""] = [],
                            linkedIns: [linkedIn = ""] = [],
                            inboundEmail = 0,
                            lastInboundEmailDate = "",
                            outboundEmail = 0,
                            lastOutboundEmailDate = "",
                            meetings = 0,
                            lastMeetingDate = "",
                        }) =>
                            [
                                name,
                                title,
                                (company && company.name) || "",
                                city,
                                state,
                                country,
                                emailAddress1,
                                emailAddress2,
                                emailAddress3,
                                twitter,
                                linkedIn,
                                inboundEmail,
                                lastInboundEmailDate,
                                outboundEmail,
                                lastOutboundEmailDate,
                                meetings,
                                lastMeetingDate,
                            ].map(c => `"${c}"`),
                    )
                    .map(r => r.join(",")),
            ).join("\r\n");
    };
    const exportContactActivity = () => {
        const csvContent = generateCSVContent();
        const filename = `contact_activity_${format(new Date(), "YYYY-MM-DD")}.csv`;
        const a = document.createElement("a");

        a.setAttribute("download", filename);
        a.setAttribute("href", csvContent);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return [contactActivity, { generateCSVContent, exportContactActivity }];
}

export function useRelationshipViewReport(userUri: string) {
    const [relationshipViewReport, setRelationshipViewReport] = useState<Partial<NetworkView> & { apiState: string }>({ apiState: apiStates.fetching });
    useEffect(() => {
        if (!userUri) return;
        let cancelled = false;
        if (!relationshipViewReport.result) {
            getEntity(NudgeUris.api.aggregateAnalysis.RunRelationshipView(userUri)._instanceUri)
                .fork(err => {
                    if (cancelled) return;
                    setRelationshipViewReport({
                        apiState: apiStates.error,
                    });
                    logger.error("Error getting relationship view report", err);
                },
                (response = {}) => {
                    if (cancelled) return;
                    setRelationshipViewReport({
                        apiState: apiStates.fetched,
                        ...response,
                    });
                });
        }
        return () => {
            cancelled = true;
        };
    }, [relationshipViewReport.result, setRelationshipViewReport, userUri]);

    return [relationshipViewReport];
}
