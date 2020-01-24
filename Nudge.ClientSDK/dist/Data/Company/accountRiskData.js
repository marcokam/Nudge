var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { getAllCommunications, getLastCommunication } from "../Interactions/InteractionsData";
import { option } from "../../Util/fp/Instances/Option";
import { hasStrongTeamRelationship, hasTeamStrength, strengthOrderingToStrength, strengthToOrdering, RelationshipStrength } from "../Person/Relationship/relationshipData";
import { List } from "../../Util/fp/Instances/List";
import { toPairs, map as objMap, fromPairs } from "../../Util/fp/object";
import { Pair } from "../../Util/fp/Instances/Pair";
import { constant } from "../../Util/fp/function";
export var getLastContact = function (people) {
    return option.of(people)
        .map(getAllCommunications)
        .map(function (communications) { return ({
        allContact: communications,
        lastContact: getLastCommunication(communications)
    }); })
        .getOrElse(function () { return undefined; });
};
export var getTeamRelationshipSummary = function (entity) {
    return option.of(entity.teamInteractions)
        .chain(function (interactions) { return option.of(function (activeRelationships) { return function (strongRelationships) { return ({ activeRelationships: activeRelationships, strongRelationships: strongRelationships }); }; })
        .ap(option.of(interactions.activeRelationships))
        .ap(option.of(interactions.strongRelationships)); })
        .getOrElse(function () { return ({ activeRelationships: 0, strongRelationships: 0 }); });
};
var combineInteractions = function (people) {
    return people.reduce(function (acc, _a) {
        var teamInteractions = _a.teamInteractions, restPerson = __rest(_a, ["teamInteractions"]);
        return option.of(teamInteractions)
            .map(function (interactions) { return (__assign(__assign({}, restPerson), { allInteractions: acc.allInteractions.concat(interactions) })); })
            .getOrElse(function () { return acc; });
    }, { allInteractions: [] });
};
var summarizePeople = function (f) { return function (peopleByUri) {
    return toPairs(peopleByUri)
        .map(function (pairs) { return pairs
        .map(function (people) { return Pair.of(f(people), people); }); });
}; };
var getMaxStrengths = function (people) {
    return people.map(function (p) { return option.of(p.teamInteractions)
        .chain(function (interactions) { return option.of(interactions.strength)
        .chain(function (strength) { return option.of(interactions.maxStrength)
        .map(function (maxStrength) { return Pair.of(strength, maxStrength)
        .bimap(strengthToOrdering, strengthToOrdering); }); }); })
        .getOrElse(function () { return Pair.of(RelationshipStrength.none, RelationshipStrength.none).bimap(strengthToOrdering, strengthToOrdering); }); })
        .reduce(function (acc, strengths) { return Pair.of(Math.max(strengths.fst(), acc.fst()), Math.max(strengths.snd(), acc.snd())); }, Pair.of(RelationshipStrength.none, RelationshipStrength.none).bimap(strengthToOrdering, strengthToOrdering));
};
var personUri = function (p) { return p.uri || ""; };
export var getTeamAccountRelationshipSummary = function (people) {
    return option.of(List.fromArray(people))
        .chain(function (people) { return option.of(function (allRelationships) { return function (strongRelationships) { return function (weakenedRelationships) {
        return ({ allRelationships: allRelationships, strongRelationships: strongRelationships, weakenedRelationships: weakenedRelationships });
    }; }; })
        .ap(option.of(people.filter(hasTeamStrength.run).groupBy(personUri))
        .map(summarizePeople(constant({}))))
        .ap(option.of(people.filter(hasStrongTeamRelationship.run).groupBy(personUri))
        .map(summarizePeople(constant({}))))
        .ap(option.of(people.groupBy(personUri))
        .map(summarizePeople(getMaxStrengths))
        .map(function (peoplePairs) { return peoplePairs
        .filter(function (personPair) { return personPair.snd().fst().fst() !== personPair.snd().fst().snd(); })
        .map(function (personPair) { return personPair.map(function (summaryPerson) { return summaryPerson
        .merge(function (strengths, people) { return Pair.of(strengths
        .bimap(strengthOrderingToStrength, strengthOrderingToStrength)
        .merge(function (strength, maxStrength) { return ({ strength: strength, maxStrength: maxStrength }); }), people); }); }); }); })); })
        .map(objMap(function (_, arr) { return arr.map(function (byUri) { return byUri.map(function (summaryPerson) { return summaryPerson.map(combineInteractions); }); }); }))
        .map(objMap(function (uri, pairs) { return fromPairs(pairs.map(function (pair) { return pair.map(function (summaryPerson) { return summaryPerson.merge(function (summary, person) { return ({ summary: summary, person: person }); }); }); })); }))
        .getOrElse(function () { return ({ allRelationships: {}, strongRelationships: {}, weakenedRelationships: {} }); });
};
//# sourceMappingURL=accountRiskData.js.map