import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { postEntity, postJson } from "@nudge/client-sdk/Util/apiUtils";
import { id } from "@nudge/client-sdk/Util/fp/function";
import { NudgeUris } from "@nudge/client-sdk/Uris/NudgeUris";
import { Task, task } from "@nudge/client-sdk/Util/fp/Instances/Task";
import { roleToGroupSubgroup } from "@nudge/client-sdk/Data/Person/Role/jobRoleData";
import { getValidLicenses } from "@nudge/client-sdk/Data/User/userData";
import { jobLevelTypeToDisplay, JobLevelDisplay } from "@nudge/client-sdk/Data/Person/Level/jobLevelData";
import { option, tryCatch } from "@nudge/client-sdk/Util/fp/Instances/Option";
import { optLast, optHead } from "@nudge/client-sdk/Util/fp/array";
import { getEntity } from "@nudge/client-sdk/Util/apiUtils";

import authorization from "~/App/authorization.js";
import { trackingId } from "~/App/Utils/singletons.js";

export const AnalyticsContext = React.createContext({});
export const EventNames = {
    LoadedApp: "Loaded App",
    Page: "Page",
    UserEngagement: "User Engagement",
};

class Provider extends Component {
    constructor(props) {
        super(props);

        const { location } = props;
        const { mode = "", context = "" } = queryString.parse(location.search);

        this.trackingId = trackingId;
        this.client = Nudge.routePrefix.includes("salesforce") ? "salesforce" : context || mode || "standard";
        this.state = {
            track: this.track,
        };
    }
    render() {
        return <AnalyticsContext.Provider value={this.state}>{this.props.children}</AnalyticsContext.Provider>;
    }
    componentDidMount() {
        const { initializedPromise } = this.props;
        if (authorization.getAccessToken()) {
            postEntity(NudgeUris.v2.users().current().access, {
                accessType: "Widgets",
            }).fork(err => logger.error(err), id);
            postJson(`${Nudge.urls.webApp}/track`, {
                trackingId: this.trackingId,
                name: EventNames.LoadedApp,
                context: this.client,
            }).fork(err => logger.error(err), id);
            if (window.pendo) {
                Task.of(initializedPromise)
                    .map(_ => Nudge.userDetailData)
                    .map(n => ({ defaultResult: { level: JobLevelDisplay.unknown, role: "", subRole: "",  title: "" }, user: n }))
                    .chain(({ defaultResult, user }) => option.of(user.personUri)
                        .traverse2(task, personUri => getEntity(personUri, { fields: `level,roles,title` }))
                        .map(optPerson => optPerson
                            .chain(({ level = "unknown", roles, title = "" }) => optHead(roles)
                                .map(firstRole => roleToGroupSubgroup(firstRole))
                                .chain(roleSubRole => tryCatch(() => jobLevelTypeToDisplay(level))
                                    .map(level => ({ level, role: roleSubRole.fst(), subRole: roleSubRole.snd(), title })))
                                .getOrElse(() => defaultResult))))
                    .fork(err => {
                        logger.error("Error getting user person", err);
                    }, (person) => {
                        const n = Nudge.userDetailData;
                        const { level, role, subRole, title } = person;
                        const visitor = { id: n.userName,
                            email: n.usrEml,
                            full_name: n.name,
                            level,
                            role,
                            subRole,
                            title,
                        };
                        const license = getValidLicenses()
                            .map(ls => ls[0])
                            .map(({ companyAccountId: id, companyAccountProductLevel: planLevel }) => ({ id, planLevel }))
                            .getOrElse(() => ({}));
                        const domain = option.of(n.usrEml)
                            .map(e => e.split("@"))
                            .map(parts => parts.filter(Boolean))
                            .chain(optLast)
                            .getOrElse(() => "");
                        const pendoObj = {
                            visitor,
                            account: {
                                ...license,
                                companyName: n.companyName,
                                domain,
                            }
                        };
                        pendo.initialize(pendoObj);
                    });
            }
        }
    }
    track = (name, properties) => {
        logger.info("track", name, properties);
        const accessToken = authorization.getAccessToken();
        const trackEndpoint = accessToken ? `${Nudge.urls.webApp}/track` : `${Nudge.urls.webApp}/track/anonymous`;
        const anonymousProps = accessToken ? {} : { appId: "widgets" };
        if (accessToken) {
            postJson(trackEndpoint, {
                trackingId: this.trackingId,
                name,
                url: document.location.hash.replace("#", ""),
                context: this.client,
                ...anonymousProps,
                ...properties,
            }).fork(err => logger.error(err), id);
        }
    }
}

export const AnalyticsProvider = withRouter(Provider);
