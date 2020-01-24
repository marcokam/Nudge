import React from "react";
import { Person } from "../../Data/NudgeInterfaces";
import { Cache } from "../../Data/DataInterfaces";
import { PersonProfileProps } from "../Company/OrgChart/OrgChart";
import { FlaggedDataReason } from "../../Data/Person/Metadata/flagData";
interface PersonSummaryProps {
    person: Person;
    PersonProfile: React.FunctionComponent<PersonProfileProps>;
    style?: React.CSSProperties;
    cache?: Cache;
    flaggedUris?: Record<string, string>;
    flagUri?: (uri: string, reason?: FlaggedDataReason) => void;
}
export declare const PersonSummary: React.FunctionComponent<PersonSummaryProps>;
export {};
