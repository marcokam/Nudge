import React, { useState, useRef, useCallback, useMemo, Fragment } from "react";

import { Cache } from "~/Data/DataInterfaces";

import { entries } from "~/Util/fp/object";
import { noop } from "~/Util/fp/function";
import { List } from "~/Util/fp/Instances/List";
import { ApiStates, apiStates } from "~/Util/apiUtils";
import { Compare } from "~/Util/fp/Instances/Compare";
import { OrgChartPerson, ByLevelByRole } from "./hooks";
import { numCompareByDir, Ordering } from "~/Util/sortUtils";
import { option, tryCatch } from "~/Util/fp/Instances/Option";
import { simplePlural } from "~/Util/nameUtils";
import { strengthToText, RelationshipStrength } from "~/Data/Person/Relationship/relationshipData";
import { recommendedSort } from "~/Data/Person/Recommender/personRecommenderData";
import { byRoleGroupName } from "~/Data/Person/Role/jobRoleData";
import { JobLevelDisplay } from "~/Data/Person/Level/jobLevelData";

import { WiFiIcon } from "~/Components/Icons/Icons";
import { PersonSummary } from "~/Components/Person/PersonSummary";
import { Tooltip } from "~/Components/UI/Tooltip/Tooltip";
import { FlaggedDataReason, flaggedDataReason } from "~/Data/Person/Metadata/flagData";


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
    flaggedUris?: Record<string,string>;
    flagUri?: (uri: string, reason?: FlaggedDataReason) => void;
};

const formatRole = (role = "") => role.replace(/ /g, "_");
const getPersonId = (personUri: string) => personUri.replace(/\//g, "_")

export const OrgChart: React.FunctionComponent<OrgChartProps> = ({
    onScroll,
    apiState,
    count,
    allRoles,
    allPeople,
    allRolesOrdering,
    cells: [cellSelected, setCellSelected],
    cellFooter,
    open: [cellOpen, setCellOpen],
    PersonProfile,
    cache,
    peoplePerCell = 4,
    ignoreTeamInteractions = false,
    flaggedUris = {},
    flagUri = noop,
}) => {
    const [showPersonSummary, setShowPersonSummary] = useState();
    const scrollRef = useRef(null);
    const hideSummary = () => {
        setShowPersonSummary(null);
    }
    const showSummary = (person: OrgChartPerson) => () => {
        setShowPersonSummary(
            <Tooltip parent={scrollRef.current} targetSelector={`#${getPersonId(person.uri)}`} hide={hideSummary} className="bg-white z-5 relative">
                <span className="absolute pa3 pointer black-60 hover-bold f4" style={{ top: 0, right: 0 }} onClick={hideSummary}>✕</span>
                <PersonSummary person={person} PersonProfile={PersonProfile} cache={cache} flaggedUris={flaggedUris} flagUri={(prefix, reason) => {
                    flagUri(prefix, reason);
                    if (reason === flaggedDataReason.incorrectCompany) {
                        hideSummary();
                    }
                }} />
            </Tooltip>
        );
    };
    const navigateToCell = useCallback((key, cb?: Function) => {
        setCellSelected(key);
        // These should probably be IO.of
        return option.of((n: HTMLElement) => {
            let scrollContainer: HTMLDivElement;
            let scrollTimeout: NodeJS.Timeout;
            const handler = () => {    
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (cb) cb({ currentTarget: n });
                    if (scrollRef.current) {
                        scrollContainer = scrollRef.current as unknown as HTMLDivElement;
                        scrollContainer.removeEventListener("scroll", handler);
                    }
                }, 200);
            }
            if (scrollRef.current) {
                scrollContainer = scrollRef.current as unknown as HTMLDivElement;
                scrollContainer.addEventListener("scroll", handler);
                handler();                
            }
            n.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "center",
            });
            return n;
        })
            .ap(option.of(document.querySelector(`#${key}`)))
            .getOrElse(() => undefined);
    }, [setCellSelected]);
    const risks = useMemo(() => ({
        ["Weakening Exec Relationships"]: allPeople
            .filter(([displayLevel]) => displayLevel === JobLevelDisplay["C-Level"] || displayLevel === JobLevelDisplay.VP)
            .reduce((acc, [_, byRole]) =>
                acc.concat(
                    List.fromArray(entries(byRole))
                        .chain(([_, people]) => List.fromArray(people))
                        .toArray()    
                ), [] as OrgChartPerson[])
            .filter(e =>
                tryCatch(() => e.risks)
                    .map(risks => risks.exec && risks.weakened)
                    .getOrElse(() => false))
            .sort(recommendedSort(byRoleGroupName(allRolesOrdering)).run)
    }), [allPeople, allRolesOrdering]);
    
    const tagClasses = "ba b--red br-pill ph2 red f6 fw6 no-user-select nowrap";

    return (
        <Fragment>
            {entries(risks).map(([riskName, people]) => (
                <div key={riskName} className="flex items-center bg-nudge-lightest-red mw-100 overflow-x-auto overflow-y-hidden bb b--black-10">
                    {people.length > 0 && <div className="sticky h-100 flex items-center bg-nudge-lightest-red ph3 br b--black-10" style={{ left: 0 }}><span className={tagClasses}>{riskName}</span></div>}
                    {people.map(p => (
                        <div key={p.uri} title="Click to review" className="pointer pa3 link hover-bg-nudge-light-blue br b--black-10" onClick={() => {
                            navigateToCell(getPersonId(p.uri), showSummary(p));
                        }}>
                            <PersonProfile name={p.name} title={p.title} imageTitle="Click to review" className="mw4" />
                            {tryCatch(() => {
                                const { teamInteractions = {} } = p;
                                const { strength = RelationshipStrength.none, maxStrength = RelationshipStrength.none } = teamInteractions;
                                return { strength: strengthToText(strength), maxStrength: strengthToText(maxStrength) };
                            }).map(({ strength, maxStrength }) => (
                                <div className="flex f7 nowrap">
                                    <div>
                                        <span className="red fw6 nowrap mr1">
                                            {maxStrength}
                                        </span>
                                        →
                                        <span className="red fw6 nowrap ml1">
                                            {strength}
                                        </span>
                                    </div>
                                </div>
                            )).getOrElse(() => null)}
                        </div>
                    ))}
                </div>
            ))}
            <div ref={scrollRef} onScroll={onScroll} className="overflow-auto relative h-100">
                {showPersonSummary}
                <table className={`collapse glow ${apiState === apiStates.fetching ? "o-70" : ""}`}>
                    <thead>
                        <tr>
                            <th className="sticky z-3 bg-white bb br b--black-10 fw6" style={{ top: 0, left: 0 }}>
                                <span className="flex justify-center sticky nowrap ba b--white" style={{ top: 0 }}>
                                    {count} {simplePlural(count, "contact")}
                                </span>
                            </th>
                            {allRoles
                                .map(role => [role, formatRole(role)])
                                .map(([role, roleNoSpaces]) => (
                                    <th
                                        key={`header_${role}`}
                                        className="sticky z-2 bg-white bb br bl b--black-10"
                                        style={{ top: 0 }}
                                        id={`header_${roleNoSpaces}`}
                                    >
                                        <span className="flex justify-center ph2 pv1 white-90 nowrap no-user-select bg-dark-green ba b--dark-green">
                                            {role}
                                        </span>
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allPeople
                            .map(([level, roles = {}]) => ({ level, roles, roleEntries: Object.entries(roles) }))
                            .map(({ level, roles, roleEntries }) => ({
                                level,
                                roles,
                                rolesCount: roleEntries.reduce((acc, [_, people = []]) => acc + people.length, 0),
                                sortedRolesEntries: roleEntries
                                    .sort(Compare.of(numCompareByDir(true))
                                        .contramap<[string, Partial<OrgChartPerson>[]]>(([role]) => allRolesOrdering[role]).run)
                            }))
                            .map(({ level, roles, rolesCount, sortedRolesEntries }) => (
                                <tr key={level}>
                                    <td
                                        className="sticky collapse z-1 bg-white v-top fw6 bt bb b--black-10"
                                        style={{ left: 0 }}
                                    >
                                        <span
                                            className="flex z-2 justify-center sticky ph2 pv1 white-90 nowrap no-user-select bg-purple ba b--purple"
                                            style={{ top: 31 }}
                                        >
                                            {level} ({rolesCount})
                                        </span>
                                        <span className="flex flex-column z-1">
                                            {sortedRolesEntries
                                                .map(([role, people = []]): [string, Partial<OrgChartPerson>[], string] => [role, people, formatRole(role)])
                                                .map(([role, people, roleNoSpaces]) => ({
                                                    key: `${level}_${roleNoSpaces}`,
                                                    role,
                                                    roleCount: people.length,
                                                    teamRelsCount: people.filter(p => p.hasTeamInteraction).length,
                                                    hasTeamInteraction: people.some(p => p.hasTeamInteraction),
                                                }))
                                                .map(({ key, role, roleCount, teamRelsCount, hasTeamInteraction }) => (
                                                    <div
                                                        key={`${key}_summary`}
                                                        className={`relative z-1 f6 fw5 ph2 pv1 white-90 nowrap no-user-select pointer ba ${(ignoreTeamInteractions || hasTeamInteraction) ? "bg-green" : "bg-dark-green o-40"} ${key === cellSelected ? "b--red" : "b--dark-green"}`}
                                                        onClick={() => navigateToCell(key)}
                                                    >
                                                        <div className="z-0 absolute absolute--fill bg-dark-green" style={{ width: `${teamRelsCount / roleCount * 100}%` }}></div>
                                                        <div className="z-1 relative flex justify-between">
                                                            <span className="mr2">{role}</span>
                                                            <span>{roleCount}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </span>
                                    </td>
                                    {allRoles
                                        .map(role => [role, formatRole(role)])
                                        .map(([role, roleNoSpaces]) => ({
                                            key: `${level}_${roleNoSpaces}`,
                                            people: roles[role],
                                        }))
                                        .map(({ key, people }) => (
                                            <td
                                                key={key}
                                                className={`relative collapse pa1 v-top ba b--black-10 ${
                                                    !people ? "bg-near-white" : ""
                                                }`}
                                            >
                                                <div
                                                    className={`flex flex-column relative ba ${
                                                        key === cellSelected ? "b--red" : "b--transparent"
                                                    }`}
                                                >
                                                    <span id={key} className="absolute" style={{ top: -40 }} />
                                                    {option
                                                        .of(people)
                                                        .map(people => (
                                                            <React.Fragment key={`${key}_wrapper`}>
                                                                <div
                                                                    className={`overflow-y-hidden`}
                                                                    style={{
                                                                        transition: "max-height 0.3s ease-in-out",
                                                                        maxHeight: cellOpen[key]
                                                                            ? 51 * people.length
                                                                            : 51 * 4,
                                                                    }}
                                                                >
                                                                    {people.map((p: OrgChartPerson) => {
                                                                        const {
                                                                            uri = "",
                                                                            name = "",
                                                                            title = "",
                                                                            imageUrl = "",
                                                                            strength = RelationshipStrength.none,
                                                                            hasTeamInteraction = false,
                                                                        } = p;
                                                                        const flagged = !!flaggedUris[uri];
                                                                        const selectedClass = getPersonId(uri) === cellSelected ? "ba b--red" : "";
                                                                        const flaggedClass = flagged ? "bg-nudge-highlight-background" : "hover-bg-nudge-light-blue";
                                                                        const interactedClass = !flagged && (ignoreTeamInteractions || hasTeamInteraction) ? "" : "o-40";
                                                                        
                                                                        return (
                                                                            <div
                                                                                className={`flex items-center pr1 bg-animate ${selectedClass} ${flaggedClass}`}
                                                                                key={uri}
                                                                                id={getPersonId(uri)}
                                                                                style={{ width: 290, height: 51 }}
                                                                                onClick={showSummary(p)}
                                                                            >
                                                                                <PersonProfile
                                                                                    size={30}
                                                                                    name={name}
                                                                                    title={title}
                                                                                    imageUrl={imageUrl}
                                                                                    className={`pv2 ph1 glow w5 pointer ${interactedClass}`}
                                                                                />
                                                                                {hasTeamInteraction && (
                                                                                    <WiFiIcon
                                                                                        type="collab"
                                                                                        level={strength}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {people.length > peoplePerCell && (
                                                                    <React.Fragment>
                                                                        <a
                                                                            className={`db tr nudge-blue link pointer f6 ph2`}
                                                                            onClick={() => {
                                                                                setCellOpen((prevOpen: CellOpen): CellOpen => ({
                                                                                    ...prevOpen,
                                                                                    [key]: !prevOpen[key],
                                                                                }));
                                                                            }}
                                                                        >
                                                                            {cellOpen[key] ? "Less" : "More"}
                                                                        </a>
                                                                        {cellFooter}
                                                                    </React.Fragment>
                                                                )}
                                                            </React.Fragment>
                                                        ))
                                                        .getOrElse(() => null)}
                                                </div>
                                            </td>
                                        ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}