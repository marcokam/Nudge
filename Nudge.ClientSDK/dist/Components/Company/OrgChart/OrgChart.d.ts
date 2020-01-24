import React from "react";
import { Cache } from "../../../Data/DataInterfaces";
import { ApiStates } from "../../../Util/apiUtils";
import { ByLevelByRole } from "./hooks";
import { Ordering } from "../../../Util/sortUtils";
import { FlaggedDataReason } from "../../../Data/Person/Metadata/flagData";
interface CellOpen {
    [k: string]: boolean;
}
export interface PersonProfileProps {
    size?: number;
    name: string;
    title: string;
    imageUrl?: string;
    imageTitle?: string;
    className?: string;
    onClick?: (event: Event) => void;
}
interface OrgChartProps {
    onScroll: () => void;
    apiState: keyof ApiStates;
    count: number;
    allRoles: string[];
    allPeople: ByLevelByRole;
    allRolesOrdering: Ordering;
    cells: [string, (k: string) => void];
    cellFooter: React.Component;
    open: [CellOpen, (f: (prev: CellOpen) => CellOpen) => void];
    PersonProfile: React.FunctionComponent<PersonProfileProps>;
    cache?: Cache;
    peoplePerCell: number;
    ignoreTeamInteractions: boolean;
    flaggedUris?: Record<string, string>;
    flagUri?: (uri: string, reason?: FlaggedDataReason) => void;
}
export declare const OrgChart: React.FunctionComponent<OrgChartProps>;
export {};
