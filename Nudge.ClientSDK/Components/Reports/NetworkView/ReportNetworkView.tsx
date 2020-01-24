import React from "react";
import { NetworkViewPerson, NetworkViewCompany } from "~/Data/Report/ReportInterfaces";
import { NudgeUris } from "~/Uris/NudgeUris";
import NudgeLink from "~/Components/UI/Link/NudgeLink";
import ProfileImage from "~/Components/UI/Image/ProfileImage";

interface PersonProfileProps {
    agg: Partial<NetworkViewPerson>;
    size: number;
}
export const PersonProfile: React.FunctionComponent<PersonProfileProps> = ({ agg = {}, size = 30, ...containerProps }) => {
    const { aggId = 0, aggDspNam = "", imgThmUrl = "" } = agg;
    const uri = NudgeUris.v2.people(`/v2/people/${aggId}`)._instanceUri;
    return (
        <NudgeLink key={uri} to={`/contactProfilePage?id=${aggId}`} className="link dib mr2 no-underline" {...containerProps}>
            <ProfileImage uid={aggDspNam} className="person br-100" name={aggDspNam} src={imgThmUrl} size={size} />
        </NudgeLink>
    );
}

interface CompanyProfileProps {
    company: Partial<NetworkViewCompany>;
    size: number;
}
export const CompanyProfile: React.FunctionComponent<CompanyProfileProps> = ({ company = {}, size = 30, ...containerProps }) => {
    const { cmpAggId = 0, cmpDspNam = "", lgoLrg = "" } = company;
    const uri = NudgeUris.v2.companies(`/v2/companies/${cmpAggId}`)._instanceUri;
    return (
        <NudgeLink key={uri} to={`/companyDetailPage?id=${cmpAggId}`} className="link dib mr2 no-underline" {...containerProps}>
            <ProfileImage uid={cmpDspNam} className="company br2" name={cmpDspNam} src={lgoLrg} size={size} />
        </NudgeLink>
    );
}