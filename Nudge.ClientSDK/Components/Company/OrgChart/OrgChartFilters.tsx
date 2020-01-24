import React from "react";
import { orgChartFilters } from "./hooks";

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

export const OrgChartFilters: React.FunctionComponent<OrgChartFiltersProps> = ({ onSetFilter, filters, filterCounts }) => {
    return (
        <div className="flex f7">
            <div className="checkbox mr2">
                <input id="all" type="checkbox" className="dn" checked={filters.all} onChange={onSetFilter(orgChartFilters.all)} />
                <label htmlFor="all" className="flex items-center justify-center h-100 pointer no-user-select">All ({filterCounts.all})</label>
            </div>
            <div className="checkbox mr2">
                <input id="relationshipsOnly" type="checkbox" className="dn" checked={filters.hasTeamStrength} onChange={onSetFilter(orgChartFilters.hasTeamStrength)} />
                <label htmlFor="relationshipsOnly" className="flex items-center justify-center h-100 pointer no-user-select">Active ({filterCounts.hasTeamStrength})</label>
            </div>
            <div className="checkbox mr2">
                <input id="hasStrongRelationship" type="checkbox" className="dn" checked={filters.hasStrongRelationship} onChange={onSetFilter(orgChartFilters.hasStrongRelationship)} />
                <label htmlFor="hasStrongRelationship" className="flex items-center justify-center h-100 pointer no-user-select">Strong ({filterCounts.hasStrongRelationship})</label>
            </div>
        </div>
    );
}
