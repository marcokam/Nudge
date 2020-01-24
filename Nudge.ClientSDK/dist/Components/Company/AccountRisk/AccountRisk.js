import React, { useMemo } from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { differenceInCalendarDays } from "date-fns";
import { values } from "../../../Util/fp/object";
import { option } from "../../../Util/fp/Instances/Option";
import { apiStates } from "../../../Util/apiUtils";
import { isExec, minLevel } from "../../../Data/Person/Relationship/relationshipData";
import { getTeamAccountRelationshipSummary, getLastContact } from "../../../Data/Company/accountRiskData";
import { jobLevelToOrdering, JobLevel } from "../../../Data/Person/Level/jobLevelData";
import { simplePlural } from "../../../Util/nameUtils";
export function AccountRisk(_a) {
    var _b = _a.apiState, apiState = _b === void 0 ? apiStates.none : _b, _c = _a.people, people = _c === void 0 ? [] : _c;
    var accountRisks = useMemo(function () {
        var all = getTeamAccountRelationshipSummary(people);
        var execs = getTeamAccountRelationshipSummary(people.filter(isExec.run));
        var lastContact = getLastContact(people);
        var lastContactDays = option.of(lastContact)
            .map(function (lastContact) { return lastContact.lastContact; })
            .map(function (lastContact) { return lastContact.date; })
            .map(function (date) { return differenceInCalendarDays(new Date(), date); })
            .getOrElse(function () { return Infinity; });
        var execStrong = values(execs.strongRelationships);
        var allStrong = values(all.strongRelationships);
        var strongWithLevel = allStrong.filter(function (_a) {
            var _b = _a.person, person = _b === void 0 ? {} : _b;
            return minLevel(jobLevelToOrdering(JobLevel.individual))(person);
        });
        var risks = {
            loaded: apiState === apiStates.fetched && values(all.allRelationships).length > 0,
            strongExecs: {
                show: allStrong.length === strongWithLevel.length,
                color: execStrong.length === 0 ? "red b--red " : "green b--green",
                text: execStrong.length === 0 ? "MISSING EXECS" : execStrong.length + " STRONG " + simplePlural(execStrong.length, "EXEC", "EXECS"),
            },
            strongAll: {
                show: true,
                color: allStrong.length <= 1 ? "red b--red" : "green b--green",
                text: allStrong.length === 0 ? "NO STRONG RELATIONSHIPS" : allStrong.length === 1 ? "SINGLE THREADED" : allStrong.length + " STRONG RELATIONSHIPS"
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
    var tagClasses = "ba br-pill ph2 f7 fw6 no-user-select nowrap";
    return (accountRisks.loaded && (React.createElement("div", { className: "flex items-center" },
        accountRisks.strongExecs.show && (React.createElement("div", { className: "mr2" },
            React.createElement("span", { className: tagClasses + " " + accountRisks.strongExecs.color }, accountRisks.strongExecs.text))),
        accountRisks.strongAll.show && (React.createElement("div", { className: "mr2" },
            React.createElement("span", { className: tagClasses + " " + accountRisks.strongAll.color }, accountRisks.strongAll.text))),
        accountRisks.lastContact.show && (React.createElement("div", { className: "mr2" },
            React.createElement("span", { className: tagClasses + " " + accountRisks.lastContact.color }, accountRisks.lastContact.text))))));
}
//# sourceMappingURL=AccountRisk.js.map