import React, { Fragment, useState, useEffect } from "react";        // eslint-disable-line @typescript-eslint/no-unused-vars  

import { IUser } from "~/Data/NudgeInterfaces";
import { Leaderboard } from "~/Data/Report/ReportInterfaces";
                         
import ProfileImage from "~/Components/UI/Image/ProfileImage";      
import NudgeLink from "~/Components/UI/Link/NudgeLink";                       
import registry from "~/Util/registry";
import { id } from "~/Util/fp/function";

interface ProfileLinkProps {
    to: string;
}
interface LeaderboardRowProps {
    rank: number;
    user: Partial<IUser>;
    highlightUserId: string;
    memberImageSize: number;
    generateLink?: (userId: number) => string;
}
interface ReportLeaderboardProps {
    userUri: string;
    leaderboardReport: Partial<Leaderboard> & { apiState: string };
}

export const LeaderboardRow: React.FunctionComponent<LeaderboardRowProps> = ({
    rank = 0,
    user,
    highlightUserId = 0,
    memberImageSize = 40,
    generateLink = (userId: number) => `/contactProfilePage?userId=${userId}`,
}) => {
    const { usrIdn = 0, usrDspNam = "", usrImgUrl = "", jobTtl = "", cmpNam = "", networkHealthScore } = user;
    const { strong = 0, active = 0 } = networkHealthScore || {};
    const [waUrl, setWaUrl] = useState();
    const to = generateLink(usrIdn);

    useEffect(() => {
        let cancelled = false;
        registry.webappBaseUrl.fork(id, waUrl => {
            if (cancelled) return;
            setWaUrl(waUrl);
        });
        return () => {
            cancelled = true;
        }
    }, []);

    return (
        <tr className={highlightUserId === usrIdn ? "bg-nudge-light-blue" : ""}>
            <td className="ph1 pv2" style={{ width: 28 }}>
                <NudgeLink className="link color-inherit truncate" to={to}>{rank}.</NudgeLink>
            </td>
            <td className="ph1 pv2" style={{ width: 48 }}>
                <NudgeLink className="link color-inherit truncate" to={to}>
                    <div className="flex">
                        <ProfileImage uid={usrDspNam} name={usrDspNam} src={usrImgUrl} size={memberImageSize} className="person br-100" />
                    </div>
                </NudgeLink>
            </td>
            <td className="ph1 pv2 w4 truncate">
                <NudgeLink className="link color-inherit truncate" to={to}>
                    <div className="truncate fw6">{usrDspNam}</div>
                    <div className="f7 flex items-center">
                        {waUrl && <img src={`${waUrl}/static/images/icons-sprite04-mobile/t3_lists_nhs.png`} alt="nhs" />}
                        <span className="dib tr mr1" style={{ width: 25 }}>
                            {strong}
                        </span>
                        |<span className="dib ml1 w3 tl">{active}</span>
                    </div>
                </NudgeLink>
            </td>
            <td className="ph1 pv2 truncate">
                <NudgeLink className="link color-inherit truncate" to={to}>
                    <div className="truncate">{jobTtl}</div>
                    <div className="f7 truncate">{cmpNam}</div>
                </NudgeLink>
            </td>
        </tr>
    );
}
