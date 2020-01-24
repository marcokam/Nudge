import React from "react";
import { NetworkViewPerson, NetworkViewCompany } from "../../../Data/Report/ReportInterfaces";
interface PersonProfileProps {
    agg: Partial<NetworkViewPerson>;
    size: number;
}
export declare const PersonProfile: React.FunctionComponent<PersonProfileProps>;
interface CompanyProfileProps {
    company: Partial<NetworkViewCompany>;
    size: number;
}
export declare const CompanyProfile: React.FunctionComponent<CompanyProfileProps>;
export {};
