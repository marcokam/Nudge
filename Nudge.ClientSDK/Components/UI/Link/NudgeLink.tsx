import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import registry from "~/Util/registry";
import { Task } from "~/Util/fp/Instances/Task";
import * as logger from "~/Logging/DefaultLogger";
import { ExternalLink } from "~/Components/UI/Link/ExternalLink";

const NudgeLink: React.FunctionComponent<any> = ({ children, to, ...props }) => {
    const [urls, setUrls] = useState({ baseUrl: "", waUrl: "" });

    useEffect(() => {
        let cancelled = false;
        Task.of((b: string): ((w: string) => [string, string]) => w => [b, w])
            .ap(registry.baseUrl)
            .ap(registry.webappBaseUrl)
            .fork(
                err => {
                    if (cancelled) return;
                    logger.error(err);
                },
                ([baseUrl, waUrl]) => {
                    if (cancelled) return;
                    setUrls({
                        baseUrl,
                        waUrl,
                    });
                },
            );
        return () => {
            cancelled = true;
        }
    }, []);

    const { baseUrl, waUrl } = urls;
    const isIntegrations = waUrl !== baseUrl;

    return waUrl ? (
        isIntegrations ? (
            <ExternalLink href={`${waUrl}/mobileui#${to}`} {...props}>
                {children}
            </ExternalLink>
        ) : (
            <Link to={to} {...props}>
                {children}
            </Link>
        )
    ) : null;
};

export default NudgeLink;
