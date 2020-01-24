import React, { Component } from "react";
import { select } from "d3-selection";
import transition from "d3-transition"; // eslint-disable-line no-unused-vars
import { rgb } from "d3-color";
import { compose } from "@nudge/client-sdk/Util/fp/function";
import { levelIsEqual } from "@nudge/client-sdk/Data/Person/Level/jobLevelData";
import { nameToInitials, truncateName } from "@nudge/client-sdk/Util/nameUtils";
import { strengthOrderingToText, isStrongRelationship } from "@nudge/client-sdk/Data/Person/Relationship/relationshipData";
import { getProfileColour } from "@nudge/client-sdk/Util/profileUtils";
import { summarizeData } from "@nudge/client-sdk/Components/Relationships/hooks";

import { sankey as initSankey, sankeyLinkHorizontal } from "~/App/Utils/d3-sankey.js";
import { getImgSrc, getTextImageURL } from "~/App/Utils/imageUtils.js";

import { wifiIcon } from "~/App/Components/D3/wifiIcon.js";

import "./RelationshipsGraph.scss";

class RelationshipsGraph extends Component {
    static debounceInMs = 100;
    mouseEventTimeout = null;
    containerRef = React.createRef();
    state = {
        initialized: false,
        filteredData: null,
    };
    render() {
        return <div ref={this.containerRef} className="graph tc" />;
    }
    init = () => {
        this.initGraph();
        this.setState({ initialized: true });
        return this.renderGraph();
    };
    initGraph = () => {
        const { graphSettings = {} } = this.props;
        const finalGraphSettings = {
            width:
                Math.max(
                    620,
                    Math.min(
                        900,
                        this.containerRef.current ? this.containerRef.current.offsetWidth : window.innerWidth,
                    ),
                ) * 0.9,
            outerPadding: 500,
            nodeWidth: 5,
            imageSize: 24,
            nameTextSize: 13,
            titleTextSize: 12,
            ...graphSettings,
        };
        const { nodeWidth, imageSize } = finalGraphSettings;
        const imagePadding = imageSize * 1.5;
        const nodePadding = imageSize + imagePadding / 2;
        const textPadding = imageSize + imagePadding + 8;

        this.graphSettings = {
            ...finalGraphSettings,
            imagePadding,
            nodePadding,
            textPadding,
        };

        // Initialize svg
        this.svg = select(".graph").append("svg");
        this.svg
            .append("defs")
            .append("clipPath")
            .attr("id", "profile-clip")
            .append("circle")
            .attr("cx", imageSize / 2)
            .attr("cy", imageSize / 2)
            .attr("r", imageSize / 2);
        this.svg.on("click", this.onSvgClicked);

        // Initialize profiles and paths
        this.profilesGroup = this.svg
            .append("g")
            .attr("class", "profiles")
            .attr("stroke", "none");

        this.pathsGroup = this.svg
            .append("g")
            .attr("class", "paths")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.2);

        // Initialize sankey diagram
        this.sankey = initSankey()
            .iterations(0)
            .nodeId(n => n.uri)
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding);
    };
    getCurrentData = () => {
        const { data } = this.props;
        const { filteredData } = this.state;
        return filteredData || data;
    };
    setupBounds = data => {
        const { nodes: ogNodes = [], links: ogLinks = [] } = data;
        const { width, outerPadding, nodePadding, imageSize } = this.graphSettings;
        const sumOfStrengths = ogLinks.reduce((sum, l) => sum + l.value, 0);
        const numberOfUsers = ogNodes.filter(n => isUser(n.type)).length;
        const numberOfConnectors = ogNodes.filter(n => isConnector(n.type)).length;
        const calcWidth = Math.min(window.innerWidth, width);
        const calcHeight = Math.max(Math.max(numberOfUsers, numberOfConnectors) * nodePadding + sumOfStrengths - 18, 0);
        const calcOuterPadding = calcWidth > outerPadding ? outerPadding : 480;

        this.svg
            .attr("viewBox", [-(outerPadding / 2), 0, Math.max(calcWidth, 0), Math.max(calcHeight, 0)])
            .style("width", `${calcWidth}px`)
            .style("height", `${calcHeight}px`);
        this.sankey.extent([[1, imageSize / 2], [calcWidth - calcOuterPadding, calcHeight - imageSize / 2]]);

        return { width: calcWidth, height: calcHeight, outerPadding: calcOuterPadding };
    };
    resetData = () => {
        return new Promise(resolve => {
            this.setState({ filteredData: null }, resolve);
            this.setSelectedState({ filteredSummaries: null });
        });
    };
    renderGraph = (resetData = false) => {
        const promise = resetData ? this.resetData() : Promise.resolve();

        return promise.then(() => {
            const { viewLocked, strongOnly = false } = this.props;
            const currentData = this.filterData(this.getCurrentData());
            const { width, height, outerPadding } = this.setupBounds(currentData);
            const { nodes: ogNodes = [], links: ogLinks = [], summaries = {} } = currentData;
            const { imageSize, imagePadding, nodeWidth, textPadding, nameTextSize, titleTextSize } = this.graphSettings;
            const { nodes, links } = this.sankey({
                nodes: ogNodes.map(d => ({ ...d })),
                links: ogLinks.map(d => ({ ...d })),
            });

            // update summaries to be used
            this.setSelectedState({ filteredSummaries: summaries });

            // clean up profiles that will be removed (if any)
            this.boundedProfiles = this.profilesGroup.selectAll("g").data(nodes, n => n.uri);
            const toRemove = this.boundedProfiles.exit();
            const toRemoveProfiles = toRemove.select("g");
            toRemoveProfiles.on("mouseover", null);
            toRemoveProfiles.on("mouseout", null);
            toRemoveProfiles.on("click", null);
            toRemove.remove();

            // render profiles
            this.profiles = this.boundedProfiles
                .enter()
                .append("g")
                .attr("class", "profile");

            // render blocks where paths connect
            this.profiles
                .append("rect")
                .attr("x", d => d.x0)
                .attr("width", d => d.x1 - d.x0)
                .attr("fill", d => (isUser(d.type) ? "#1a9bfc" : "orange"));

            // update existing blocks
            const mergedProfiles = this.profiles.merge(this.boundedProfiles);
            mergedProfiles.attr("transform", d => `translate(0, ${d.y0})`);
            mergedProfiles.select("rect").attr("height", d => d.y1 - d.y0);

            // render profile iamges
            this.profiles
                .append("image")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", imageSize)
                .attr("height", imageSize)
                .attr("xlink:href", d => {
                    const initials = (d.type === "company" ? nameToInitials(d.name.slice(0, 1)) : nameToInitials(d.name)) || "U";
                    const imgSrc = getImgSrc(d.imageUrl, initials, imageSize, false);
                    return imgSrc
                        ? imgSrc
                        : getTextImageURL(initials, imageSize, imageSize, "ffffff", getProfileColour(d.name || "Unknown", true));
                })
                .attr("clip-path", "url(#profile-clip)");
            mergedProfiles.select("image").attr("transform", d => {
                const x =
                    d.x0 < (width - outerPadding) / 2
                        ? d.x1 - nodeWidth - imageSize - imagePadding
                        : d.x0 + nodeWidth + imagePadding;
                const y = (d.y1 - d.y0) / 2 - imageSize / 2;
                return `translate(${x}, ${y})`;
            });

            // render profile name, title and counts
            const labels = this.profiles
                .append("text")
                .attr("x", d =>
                    d.x0 < (width - outerPadding) / 2 ? d.x1 - nodeWidth - textPadding : d.x0 + nodeWidth + textPadding,
                )
                .attr("text-anchor", d => (d.x0 < (width - outerPadding) / 2 ? "end" : "start"))
                .attr("style", "user-select: none; -moz-user-select: none; -ms-user-select: none;");
            labels
                .append("tspan")
                .attr("class", "name")
                .style("font-size", `${nameTextSize}px`)
                .style("font-weight", "501")
                .text(d => truncateName(d.name) || "Unknown");
            labels
                .append("tspan")
                .attr("class", "title")
                .attr("dy", nameTextSize * 1.1)
                .style("font-size", `${titleTextSize}px`)
                .attr("x", d =>
                    d.x0 < (width - outerPadding) / 2 ? d.x1 - nodeWidth - textPadding : d.x0 + nodeWidth + textPadding,
                )
                .attr("dy", nameTextSize * 1.1)
                .text(d => (d.type === "user" ? truncateName(d.jobTitle) : truncateName(d.title)));
            labels
                .append("tspan")
                .attr("class", "count")
                .attr("x", d =>
                    d.x0 < (width - outerPadding) / 2
                        ? d.x1 + imagePadding + imageSize
                        : d.x0 - imagePadding - imageSize,
                )
                .style("font-size", `${titleTextSize}px`)
                .attr("x", d =>
                    d.x0 < (width - outerPadding) / 2
                        ? d.x1 - nodeWidth - imagePadding / 4
                        : d.x0 + nodeWidth + imagePadding / 4,
                )
                .attr("dy", d => (d.jobTitle || d.title ? -nameTextSize * 0.6 : 0));

            mergedProfiles
                .select("text")
                .attr("transform", d => {
                    const y = (d.y1 - d.y0) / 2 + (d.jobTitle || d.title ? -nameTextSize * 0.2 : nameTextSize * 0.3);
                    return `translate(0, ${y})`;
                })
                .select("tspan.count")
                .text(d => {
                    const summaryText = `${strongOnly ? summaries[d.uri]["Strong Connections"] || summaries[d.uri].total : summaries[d.uri]["Active Connections"] || summaries[d.uri].total}`;
                    // not locked view, or has more than 1 connection, show regular summary text
                    if (!viewLocked || d.sourceLinks.length > 1 || d.targetLinks.length > 1) {
                        return summaryText;
                    }
                    const { source = {}, target = {} } =
                        (d.sourceLinks && d.sourceLinks[0]) || (d.targetLinks && d.targetLinks[0]) || {};

                    // ignore if we are looking at company relationships
                    if ([source.type, target.type].some(t => t === "company")) {
                        return summaryText;
                    }
                    return "";
                });

            if (viewLocked) {
                mergedProfiles
                    .append("g")
                    .attr("class", "wifi")
                    .attr("transform", d => {
                        const x = d.x0 < (width - outerPadding) / 2 ? d.x0 - nodeWidth - 25 : d.x1 + nodeWidth;
                        const y = (d.y1 - d.y0) / 2 - 25 / 2;
                        return `translate(${x}, ${y})`;
                    })
                    .each(generateWifi);
            } else {
                mergedProfiles.select("g.wifi").remove();
            }

            // Render paths
            this.boundedPaths = this.pathsGroup.selectAll("g").data(links, l => `${l.source.uri}${l.target.uri}`);
            this.boundedPaths.exit().remove();
            this.paths = this.boundedPaths.enter().append("g");
            this.paths
                .append("path")
                .attr("d", sankeyLinkHorizontal())
                .attr("class", "path")
                .attr("stroke", d => rgb(d.color).darker(2))
                .attr("stroke-width", d => Math.max(1, d.width));
            this.paths
                .append("title")
                .text(
                    d =>
                        `${d.source.name} ↔ ${d.target.name}\n${
                            d.active ? formatCompanyLink(d) : formatPersonLink(d.value)
                        }`,
                );
            // update existing paths
            this.paths
                .merge(this.boundedPaths)
                .select("path")
                .transition()
                .attr("stroke-width", d => Math.max(1, d.width))
                .attr("d", sankeyLinkHorizontal());

            // mergedProfiles.on("mouseover", this.onProfileMouseover);
            // mergedProfiles.on("mouseout", this.onProfileMouseout);
            mergedProfiles.on("click", this.onProfileClicked);

            return { width, height };
        });
    };
    highlightSelectedProfile = selectedProfile => {
        const shouldHighlightSourceAndTarget = d =>
            d.source.uri === selectedProfile.uri || d.target.uri === selectedProfile.uri;
        const shouldUnselectSourceAndTarget = d => !shouldHighlightSourceAndTarget(d);
        const sourceAndTargetUris = {
            sources: new Set(),
            targets: new Set(),
        };
        this.paths
            .merge(this.boundedPaths)
            .filter(shouldHighlightSourceAndTarget)
            .attr("class", null)
            .each(p => {
                sourceAndTargetUris.sources.add(p.source.uri);
                sourceAndTargetUris.targets.add(p.target.uri);
            });
        this.paths
            .merge(this.boundedPaths)
            .filter(shouldUnselectSourceAndTarget)
            .attr("class", "unselected");

        const shouldUnselectUri = d =>
            !sourceAndTargetUris.sources.has(d.uri) && !sourceAndTargetUris.targets.has(d.uri);
        const shouldHighlightUri = d => !shouldUnselectUri(d);
        this.profiles
            .merge(this.boundedProfiles)
            .filter(shouldHighlightUri)
            .attr("class", "profile");
        this.profiles
            .merge(this.boundedProfiles)
            .filter(shouldUnselectUri)
            .attr("class", "profile unselected");
        this.setSelectedState({ selectedProfile });
    };
    resetHighlights = () => {
        this.paths.merge(this.boundedPaths).attr("class", null);
        this.profiles.merge(this.boundedProfiles).attr("class", "profile");
        this.setSelectedState({ selectedProfile: {} });
    };
    setSelectedState = ({ selectedProfile, viewLocked }) => {
        const { update } = this.props;
        const currentData = this.filterData(this.getCurrentData());
        let newState = { ...currentData };
        
        if (selectedProfile) {
            if (selectedProfile.uri) {
                const { type, uri, name, title, jobTitle, imageUrl } = selectedProfile;
                // A bit of a hack.  Uri needed to be unique so we added /team in front if they were a team member
                newState.selectedProfile = { type, uri: uri.replace("/team", ""), name, title: title || jobTitle || "", imageUrl };
            } else {
                newState.selectedProfile = selectedProfile;
            }
        }
        if (viewLocked !== undefined) {
            newState.viewLocked = viewLocked;
        }
        update(newState);
    };
    lock = selectedProfile => {
        const { data } = this.props;
        const preformat = preformatData(data);
        const summarizedData = compose(
            summarizeData,
            preformat,
            filterBySelectedProfile(selectedProfile),
        )(data);
        this.setState({ filteredData: summarizedData }, this.renderGraph);
    };
    unlock = () => {
        this.renderGraph(true);
    };
    filterByLevel = jobLevel => data => {
        const preformat = preformatData(this.getCurrentData());
        return compose(
            preformat,
            filterByJobLevel(jobLevel, levelIsEqual),
        )(data);
    }
    filterByRole = role => data => {
        const preformat = preformatData(this.getCurrentData());
        return compose(
            preformat,
            filterByJobRole(role),
        )(data);
    };  
    filterStrongOnly = data => {
        const preformat = preformatData(this.getCurrentData());
        return compose(
            preformat,
            filterStrongRelationships(),
        )(data);
    };   
    filterData = dataToFilter => {
        const { selectedJobLevel, selectedRole, strongOnly = false } = this.props;
        const identity = i => i;
        return compose(
            summarizeData,
            selectedRole ? this.filterByRole(selectedRole) : identity,
            selectedJobLevel ? this.filterByLevel(selectedJobLevel) : identity,
            strongOnly ? this.filterStrongOnly : identity,
        )(dataToFilter);
    };
    setFilter = () => {
        const { selectedJobLevel, selectedRole, strongOnly } = this.props;
        const resetData = !!(selectedJobLevel || selectedRole || strongOnly);
        this.renderGraph(resetData);
    };
    onSvgClicked = () => {
        this.setSelectedState({ selectedProfile: {}, viewLocked: false });
    }
    onProfileClicked = selectedProfile => {
        event.stopPropagation();
        this.setSelectedState({ selectedProfile, viewLocked: true });
    };
    onProfileMouseover = selectedProfile => {
        const { viewLocked } = this.props;
        if (viewLocked) return;
        clearTimeout(this.mouseEventTimeout);
        this.mouseEventTimeout = setTimeout(
            () => this.highlightSelectedProfile(selectedProfile),
            RelationshipsGraph.debounceInMs,
        );
    };
    onProfileMouseout = () => {
        const { viewLocked } = this.props;
        if (viewLocked) return;
        clearTimeout(this.mouseEventTimeout);
        this.mouseEventTimeout = setTimeout(this.resetHighlights, RelationshipsGraph.debounceInMs);
    };
}

const WrappedRelationshipsGraph = React.forwardRef((props, ref) => <RelationshipsGraph ref={ref} {...props} />);
WrappedRelationshipsGraph.displayName = "RelationshipsGraph";

export default WrappedRelationshipsGraph;

const isUser = type => ["me", "user"].includes(type);
const isConnector = type => ["person", "company"].includes(type);
const formatPersonLink = s => `Strength: ${strengthOrderingToText(s)}`;
const formatCompanyLink = ({ active = 0, strong = 0 }) =>
    `Strong Connections: ${strong}  Active Connections: ${active}`;
const addIfExists = (key = "", lookup = {}, result = new Set()) => {
    if (lookup.hasOwnProperty(key)) {
        result.add(lookup[key]);
    }
};
const filterLinksAndNodes = (keepLink = i => i) => ({ links = [], users = {}, people = {}, companies = {} }) =>
    links.reduce(
        (result, link) => {
            if (keepLink({ link, users, people, companies })) {
                result.links.push(link);
                addIfExists(link.source, users, result.users);
                addIfExists(link.target, people, result.people);
                addIfExists(link.target, companies, result.companies);
            }
            return result;
        },
        { users: new Set(), people: new Set(), companies: new Set(), links: [] },
    );
const filterBySelectedProfile = selectedProfile =>
    filterLinksAndNodes(({ link = {} }) => selectedProfile.type === "user" ? link.source.replace("/team", "") === selectedProfile.uri : link.target === selectedProfile.uri);
const filterByJobLevel = (jobLevel, comparator) =>
    filterLinksAndNodes(({ link = {}, people = {} }) => {
        const { target = "" } = link;
        const person = people[target];
        return person && comparator(person.level, jobLevel);
    });
const filterByJobRole = role =>
    filterLinksAndNodes(({ link = {}, people = {} }) => {
        const { target = "" } = link;
        const person = people[target];
        return (
            person &&
            person.roles.length &&
            person.roles.some(({ name = "" }) => {
                const [groupName = ""] = name.split("-");
                return groupName.trim() === role;
            })
        );
    });
const isCompanyTarget = target => target.includes("/v2/companies");
const filterStrongRelationships = () =>
    filterLinksAndNodes(({ link = {} }) => {
        const { target = "", strong = 0, value = 0 } = link;
        return isCompanyTarget(target) ? strong > 0 : isStrongRelationship(value);
    });
const preformatData = startingData => ({ users = [], people = [], companies = [], links = [] }) => ({
    ...startingData,
    userValues: Array.from(users),
    personValues: Array.from(people),
    companyValues: Array.from(companies),
    links,
});
const generateWifi = (d, i, els) => {
    const fillColour = "#1a9bfc";
    const baseColour = "#ddd";

    // only show strength if there is 1 connection
    if (d.sourceLinks.length > 1 || d.targetLinks.length > 1) {
        return;
    }

    const { value: level = 0, source = {}, target = {} } =
        (d.sourceLinks && d.sourceLinks[0]) || (d.targetLinks && d.targetLinks[0]) || {};

    // ignore if we are looking at company relationships
    if ([source.type, target.type].some(t => t === "company")) {
        return;
    }

    const fillColours = [baseColour, baseColour, baseColour, baseColour, baseColour].map((c, i) =>
        i < level ? fillColour : baseColour,
    );

    // render wifi icon
    wifiIcon(els[i], fillColours);
};
