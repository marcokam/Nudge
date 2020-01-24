import React from "react";
interface OrgChartFiltersProps {
    onSetFilter: (type: string) => () => void;
    filters: {
        hasTeamStrength: boolean;
        all: boolean;
        hasStrongRelationship: boolean;
        hasWeakRelationship: boolean;
        weakened: boolean;
        newExecs: boolean;
        slipping: boolean;
        missingRoles: boolean;
    };
    filterCounts: {
        all: number;
        hasTeamStrength: number;
        hasStrongRelationship: number;
        hasWeakRelationship: number;
        weakened: number;
        slipping: number;
        newExecs: number;
    };
}
export declare const OrgChartFilters: React.FunctionComponent<OrgChartFiltersProps>;
export {};
