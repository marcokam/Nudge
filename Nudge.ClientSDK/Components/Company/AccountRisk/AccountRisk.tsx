import React, { useMemo } from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { differenceInCalendarDays } from "date-fns";

import { values } from "~/Util/fp/object";
import { option } from "~/Util/fp/Instances/Option";
import { apiStates } from "~/Util/apiUtils";
import { isExec, minLevel } from "~/Data/Person/Relationship/relationshipData";
import { getTeamAccountRelationshipSummary, getLastContact } from "~/Data/Company/accountRiskData";
import { jobLevelToOrdering, JobLevel } from "~/Data/Person/Level/jobLevelData";
import { simplePlural } from "~/Util/nameUtils";


export function AccountRisk({ apiState = apiStates.none, people = [] }) {
    const accountRisks = useMemo(() => {
        const all = getTeamAccountRelationshipSummary(people);
        const execs = getTeamAccountRelationshipSummary(people.filter(isExec.run));
        const lastContact = getLastContact(people);
        const lastContactDays = option.of(lastContact)
            .map(lastContact => lastContact.lastContact)
            .map(lastContact => lastContact.date)
            .map(date => differenceInCalendarDays(new Date(), date))
            .getOrElse(() => Infinity);
        const execStrong = values(execs.strongRelationships);
        const allStrong = values(all.strongRelationships);
        const strongWithLevel = allStrong.filter(({ person = {} }) => minLevel(jobLevelToOrdering(JobLevel.individual))(person))
        const risks = {
            loaded: apiState === apiStates.fetched && values(all.allRelationships).length > 0,
            strongExecs: {
                show: allStrong.length === strongWithLevel.length,
                color: execStrong.length === 0 ? "red b--red " : "green b--green",
                text: execStrong.length === 0 ? "MISSING EXECS" : `${execStrong.length} STRONG ${simplePlural(execStrong.length, "EXEC", "EXECS")}`,
            },
            strongAll: {
                show: true,
                color: allStrong.length <= 1 ? "red b--red" : "green b--green",
                text: allStrong.length === 0 ? "NO STRONG RELATIONSHIPS" : allStrong.length === 1 ? "SINGLE THREADED" : `${allStrong.length} STRONG RELATIONSHIPS`
            },
            lastContact: {
                show: lastContactDays > 14,
                color: "red b--red",
                text: "SLIPPING",
            },
            missingExecs: apiState === apiStates.fetched && allStrong.length === strongWithLevel.length && values(execs.strongRelationships).length === 0,
            singleThreaded: apiState === apiStates.fetched && values(all.strongRelationships).length === 1,
            noStrongRelationships: apiState === apiStates.fetched && values(all.strongRelationships).length === 0,
            slipping: apiState === apiStates.fetched && lastContactDays > 14,
        };
        return risks;
    }, [people, apiState]);
    const tagClasses = "ba br-pill ph2 f7 fw6 no-user-select nowrap";


    return (
        accountRisks.loaded && (
            <div className="flex items-center">
                {accountRisks.strongExecs.show && (
                    <div className="mr2">
                        <span className={`${tagClasses} ${accountRisks.strongExecs.color}`}>{accountRisks.strongExecs.text}</span>
                    </div>  
                )}
                {accountRisks.strongAll.show && (
                    <div className="mr2">
                        <span className={`${tagClasses} ${accountRisks.strongAll.color}`}>{accountRisks.strongAll.text}</span>
                    </div>  
                )}
                {accountRisks.lastContact.show && (
                    <div className="mr2">
                        <span className={`${tagClasses} ${accountRisks.lastContact.color}`}>{accountRisks.lastContact.text}</span>
                    </div>  
                )}
                {/* {accountRisks.missingExecs && (
                    <div className="mr2">
                        <span className={tagClasses}>MISSING EXECS</span>
                    </div>
                )}
                {accountRisks.slipping && (
                    <div className="mr2">
                        <span className={tagClasses}>SLIPPING</span>
                    </div>
                )}
                {accountRisks.singleThreaded && (
                    <div className="mr2">
                        <span className={tagClasses}>SINGLE THREADED</span>
                    </div>
                )}
                {accountRisks.noStrongRelationships && (
                    <div className="mr2">
                        <span className={tagClasses}>NO STRONG RELATIONSHIPS</span>
                    </div>
                )} */}
            </div>
        )
    );
}


