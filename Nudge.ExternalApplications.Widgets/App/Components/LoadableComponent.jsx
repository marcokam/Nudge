import { lazy } from "react";

// Main Routes
export const LoadableConversations = lazy(() =>
    import(/* webpackChunkName: "Conversations" */ "~/App/Components/Conversations/ConversationsContainer.jsx"),
);
export const LoadableRelationships = lazy(() =>
    import(/* webpackChunkName: "Relationships" */ "~/App/Components/Relationships/RelationshipsContainer.jsx"),
);
export const LoadableCompanyOrgChart = lazy(() =>
    import(/* webpackChunkName: "OrgChart" */ "~/App/Components/Company/OrgChart/CompanyOrgChart.jsx"),
);
export const LoadableSampleCompanyOrgChart = lazy(() =>
    import(/* webpackChunkName: "SampleCompanyOrgChart" */ "~/App/Components/Company/OrgChart/SampleCompanyOrgChart.jsx"),
);
export const LoadableRelationshipsAndConversations = lazy(() => 
    import (/* webpackChunkName: "RelationshipsAndConversations" */ "~/App/Components/Dashboards/RelationshipsAndConversations/RelationshipsAndConversations.jsx"),
);
