import React, { Fragment, useState, useEffect, useRef, useMemo, useContext, useCallback } from "react";
import LRU from "lru-cache";
import { debounce } from "lodash";

import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";
import { throwError } from "@nudge/client-sdk/Util/fp/error";
import { apiStates } from "@nudge/client-sdk/Util/apiUtils";
import { isEmptyObject } from "@nudge/client-sdk/Util/ObjectUtils";
import { levelsToDisplay } from "@nudge/client-sdk/Data/Person/Level/jobLevelData";
import { formatRelationshipsData } from "@nudge/client-sdk/Data/Person/Relationship/relationshipData";

import { getCompanyByIdentity } from "~/App/API/Company/CompanyData.js";
import * as Messager from "~/App/Services/Messager.js";
import { AppContext } from "~/App/Context/AppContext.js";
import { WidgetContext } from "~/App/Context/WidgetContext.js";

import Loading from "~/App/Components/Loading/Loading.jsx";
import UILoading from "~/App/Components/UI/Loading/UILoading.jsx";
import JobLevelSelector from "~/App/Components/Jobs/JobLevelSelector.jsx";
import RoleSelector from "~/App/Components/Roles/RoleSelector.jsx";
import RelationshipsGraph from "~/App/Components/Relationships/RelationshipsGraph.jsx";
import WidgetsHeader from "~/App/Components/Navigation/WidgetsHeader/WidgetsHeader.jsx";
import MeasureBounds from "~/App/Components/UI/Measure/MeasureBounds.jsx";

import "./RelationshipsContainer.scss";


function RelationshipsContainer({ displayName = "", headerOffsets = {}, navParams = {}, options = { showHeader: true }, cache: parentCache }) {
    /**
     * State
     */
    const cache = useMemo(() => parentCache ? parentCache : new LRU({ max: 500, maxAge: 1000 * 60 * 60 }), [parentCache]);
    const widgetContext = useContext(WidgetContext);
    const [
        { selectedProfile, viewLocked, selectedTeamUri, unaggregatedPeople },
        { setSelectedProfile, setViewLocked, setRelationshipSummaries },
    ] = widgetContext;
    const [companyIdentity, setCompanyIdentity] = useState("");
    const [company, setCompany] = useState({});
    const [selectedJobLevel, setSelectedJobLevel] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [strongOnly, setStrongOnly] = useState(false);
    const filterTypes = {
        level: "level",
        role: "role",
    };
    const [filterBy, setFilterBy] = useState(filterTypes.level);
    const [{ apiState: relationshipsApiState, relationships = {} }, setRelationshipsData] = useState({ apiState: apiStates.fetching });
    const [graphData, setGraphData] = useState(relationships);
    const [height, setHeight] = useState(100);
    const updateHeight = useCallback(debounce(bounds => {
        setHeight(bounds.height);
    }, 50), []);

    /**
     * Refs
     */
    const relationshipsGraphRef = useRef(null);
    const scrollContainerRef = useRef(null);

    /**
     * Effects
     */
    // get company identity
    useEffect(() => {
        const { identity = "" } = navParams;
        const companyIdentity = decodeURIComponent(identity);
        setCompanyIdentity(companyIdentity);
        if (!companyIdentity) {
            setRelationshipsData({ apiState: apiStates.error, relationships: {} });
        }
    }, [navParams, setRelationshipsData]);
    // get company data
    useEffect(() => {
        if (companyIdentity) {
            getCompanyByIdentity(companyIdentity, {}, { cache })
                .map(company => (company.uri ? company : throwError("No company found")))
                .fork(
                    err => {
                        setRelationshipsData({ apiState: apiStates.error, relationships: {} });
                        logger.error(err);
                    },
                    company => {
                        setCompany(company);
                    },
                );
        }
    }, [cache, companyIdentity, setRelationshipsData]);
    // Update relationships data for company
    useEffect(() => {
        let cancelled = false;
        if (unaggregatedPeople.apiState === apiStates.fetching) {
            setRelationshipsData(prev => ({ ...prev, apiState: apiStates.fetching }));
        } else if (unaggregatedPeople.apiState === apiStates.fetched) {
            formatRelationshipsData("person", unaggregatedPeople.data)
                .fork(
                    err => {
                        if (cancelled) return;
                        logger.error("Error getting conversations", err);
                        setRelationshipsData({ apiState: apiStates.error, relationships: {} });
                    },
                    (relationships = {}) => {
                        if (cancelled) return;
                        setRelationshipsData({ apiState: apiStates.fetched, relationships });
                        setSelectedRole("");
                        setSelectedJobLevel("");
                        setStrongOnly(false);
                    },
                );
        }
        return () => {
            cancelled = true;
        };
    }, [setRelationshipsData, unaggregatedPeople.apiState, unaggregatedPeople.data]);
    // render graph after relationships data is fetched
    useEffect(() => {
        if (relationshipsGraphRef.current) {
            const { state, init, renderGraph } = relationshipsGraphRef.current;
            if (state.initialized) {
                renderGraph(true);
            } else {
                init();
            }
            setSelectedRole("");
            setSelectedJobLevel("");
            setStrongOnly(false);
        }
    }, [relationships]);
    // updates from other widgets
    useEffect(() => {
        if (
            relationshipsGraphRef.current &&
            ((!!selectedProfile.uri && viewLocked) || (!selectedProfile.uri && !viewLocked))
        ) {
            if (viewLocked) {
                if (relationshipsGraphRef.current) {
                    relationshipsGraphRef.current.lock(selectedProfile);
                }
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }
            } else if (!selectedProfile.uri) {
                if (relationshipsGraphRef.current) {
                    relationshipsGraphRef.current.unlock();
                }
            }
        }
    }, [viewLocked, selectedProfile]);
    // filter updates
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    }, [selectedTeamUri, strongOnly, selectedRole, selectedJobLevel, scrollContainerRef]);

    /**
     * Callbacks and Memos
     */
    const graphSetState = state => {
        const { viewLocked, selectedProfile } = state;

        if (viewLocked !== undefined) {
            setViewLocked(viewLocked);
            sendMessage(Messager.messageTypes.lockView, { selectedPerson: selectedProfile, viewLocked });
        }
        if (selectedProfile !== undefined) {
            setSelectedProfile(selectedProfile);
        }
        setGraphData(state);
        setRelationshipSummaries(state.summaries);
    };
    const sendMessage = useMemo(
        () => (message, payload = {}) => {
            Messager.sendMessage(message, { ...payload });
        },
        [],
    );

    /**
     * Event handlers
     */
    const onSelectLevel = (event = {}) => {
        const selectedJobLevel = (event.target && event.target.value) || "";
        setSelectedJobLevel(selectedJobLevel);
        if (relationshipsGraphRef.current) {
            relationshipsGraphRef.current.setFilter();
        }
    };
    const onSelectRole = (event = {}) => {
        const selectedRole = (event.target && event.target.value) || "";
        setSelectedRole(selectedRole);
        if (relationshipsGraphRef.current) {
            relationshipsGraphRef.current.setFilter();
        }
    };
    const onToggleStrongOnly = (event = {}) => {
        const strongOnly = (event.target && event.target.checked) || false;
        setStrongOnly(strongOnly);
        if (relationshipsGraphRef.current) {
            relationshipsGraphRef.current.setFilter();
        }
    };
    const unlockView = () => {
        setViewLocked(false);
        setSelectedProfile({});
        sendMessage(Messager.messageTypes.lockView, { selectedPerson: {}, viewLocked: false });
    };

    const {
        levels = [],
        roles = [],
        nodes = [],
        personValues = [],
        userValues = [],
    } = graphData;
    const jobLevels = levelsToDisplay(levels).map(([level, [levelDescription, count]]) => [
        level,
        `${levelDescription} (${count})`,
    ]);
    const jobRoles = roles.map(([name, set]) => [name, `${name} (${set.size})`]);
    const loadingClass = relationshipsApiState === apiStates.fetching ? "o-70" : "";

    /**
     * Render
     */
    return (
        <div ref={scrollContainerRef} className="relationships h-100 w-100 overflow-y-auto overflow-x-hidden" style={{ paddingTop: headerOffsets.top }}>
            <div className="sticky w-100 z-1" style={{ top: 0 }}>
                <MeasureBounds updateBounds={updateHeight} className="sticky w-100 z-1" style={{ top: 0 }} >
                    {options.showHeader ? <WidgetsHeader navParams={navParams} displayName={displayName} company={company} cache={cache} options={{
                        showRecommendations: true,
                        showAccountRisk: true,
                        showRelationshipsSummary: true,
                        showConversationsSummary: false,
                    }} />
                        : <h1 className="mv0 f6 pv2 ph3 bg-white">Relationships</h1>}
                    {company.uri && (
                        <Fragment>
                            <div className="flex bg-near-white h2 ph3 items-center f7 fw5">
                                {jobLevels.length > 0 && (
                                    <label htmlFor="level" className="flex items-center mr2">
                                        <span>By Job Level</span>
                                        <input
                                            id="level"
                                            name="jobFilter"
                                            type="radio"
                                            value={filterTypes.level}
                                            checked={filterBy === filterTypes.level}
                                            onChange={event => {
                                                setFilterBy(event.target.value);
                                                onSelectRole();
                                            }}
                                        />
                                    </label>
                                )}
                                {jobRoles.length > 0 && (
                                    <label htmlFor="role" className="flex items-center mr2">
                                        <span>By Role</span>
                                        <input
                                            id="role"
                                            name="jobFilter"
                                            type="radio"
                                            value={filterTypes.role}
                                            checked={filterBy === filterTypes.role}
                                            onChange={event => {
                                                setFilterBy(event.target.value);
                                                onSelectLevel();
                                            }}
                                        />
                                    </label>
                                )}
                                {(jobLevels.length > 0 || jobRoles.length > 0) && (
                                    <Fragment>
                                        <div className="mr3">
                                            {jobLevels.length > 0 && filterBy === filterTypes.level && (
                                                <JobLevelSelector
                                                    className="f7 outline-0"
                                                    jobLevels={jobLevels}
                                                    selectedLevel={selectedJobLevel}
                                                    onSelectLevel={onSelectLevel}
                                                    NoLevels={() => <span>No job levels found</span>}
                                                />
                                            )}
                                            {jobRoles.length > 0 && filterBy === filterTypes.role && (
                                                <RoleSelector
                                                    className="f7 outline-0"
                                                    roles={jobRoles}
                                                    selectedRole={selectedRole}
                                                    onSelectRole={onSelectRole}
                                                    NoRoles={() => <span>No roles found</span>}
                                                />
                                            )}
                                        </div>
                                        <div className="checkbox f7">
                                            <input id="relationshipsOnly" type="checkbox" className="dn" checked={strongOnly} onChange={onToggleStrongOnly} />
                                            <label htmlFor="relationshipsOnly" className="flex items-center justify-center h-100 pointer no-user-select">Strong only</label>
                                        </div>
                                    </Fragment>
                                )}
                            </div><div className="flex flex-column items-center bg-white ph3 pv2">
                                <div className="w-50 ph3 flex justify-between f6 fw6">
                                    <span className="nudge-blue">Team Members: {userValues.length}</span>
                                    <span className="orange">Contacts: {personValues.length}</span>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </MeasureBounds>
            </div>
            {relationshipsApiState === apiStates.fetching && isEmptyObject(relationships) ? (
                <Loading />
            ) : (
                    <div
                        className="relationships relative sankey bg-white"
                        style={{ minHeight: `calc(98% - ${height}px)`, transition: `min-height .3s ease-in-out` }}
                        onClick={() => {
                            if (viewLocked) {
                                unlockView();
                            }
                        }}
                    >
                        {relationshipsApiState === apiStates.fetching && <UILoading className="absolute flex items-center justify-center h5 w-100 z-max" />}
                        <section className="w-100 bg-white">
                            <div className={loadingClass}>
                                {!company.uri ? (
                                    <div className="pt3 ph0 tc">
                                        No company found for {`"${companyIdentity}"`}.
                                    </div>
                                ) : nodes.length === 0 && (
                                    <div className="pt3 ph0 tc">
                                        No relationships found for this team.
                                    </div>
                                )}
                            </div>
                        </section>
                        <section className={`ph0 ${loadingClass}`}>
                            <RelationshipsGraph
                                ref={relationshipsGraphRef}
                                data={relationships}
                                selectedProfile={selectedProfile}
                                selectedJobLevel={selectedJobLevel}
                                selectedRole={selectedRole}
                                strongOnly={strongOnly}
                                viewLocked={viewLocked}
                                update={graphSetState}
                            />
                        </section>
                    </div>
                )
            }
        </div>
    );
}

const WrappedRelationshipsContainer = props => (
    <AppContext.Consumer>
        {appContext =>
            <WidgetContext.Consumer>
                {widgetContext =>
                    <RelationshipsContainer appContext={appContext} widgetContext={widgetContext} {...props} />
                }
            </WidgetContext.Consumer>
        }
    </AppContext.Consumer>
);

export default WrappedRelationshipsContainer;
