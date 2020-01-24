import React from "react";
import { orgChartFilters } from "./hooks";
export var OrgChartFilters = function (_a) {
    var onSetFilter = _a.onSetFilter, filters = _a.filters, filterCounts = _a.filterCounts;
    return (React.createElement("div", { className: "flex f7" },
        React.createElement("div", { className: "checkbox mr2" },
            React.createElement("input", { id: "all", type: "checkbox", className: "dn", checked: filters.all, onChange: onSetFilter(orgChartFilters.all) }),
            React.createElement("label", { htmlFor: "all", className: "flex items-center justify-center h-100 pointer no-user-select" },
                "All (",
                filterCounts.all,
                ")")),
        React.createElement("div", { className: "checkbox mr2" },
            React.createElement("input", { id: "relationshipsOnly", type: "checkbox", className: "dn", checked: filters.hasTeamStrength, onChange: onSetFilter(orgChartFilters.hasTeamStrength) }),
            React.createElement("label", { htmlFor: "relationshipsOnly", className: "flex items-center justify-center h-100 pointer no-user-select" },
                "Active (",
                filterCounts.hasTeamStrength,
                ")")),
        React.createElement("div", { className: "checkbox mr2" },
            React.createElement("input", { id: "hasStrongRelationship", type: "checkbox", className: "dn", checked: filters.hasStrongRelationship, onChange: onSetFilter(orgChartFilters.hasStrongRelationship) }),
            React.createElement("label", { htmlFor: "hasStrongRelationship", className: "flex items-center justify-center h-100 pointer no-user-select" },
                "Strong (",
                filterCounts.hasStrongRelationship,
                ")"))));
};
//# sourceMappingURL=OrgChartFilters.js.map