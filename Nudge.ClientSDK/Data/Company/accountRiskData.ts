import { Communication, getAllCommunications, getLastCommunication } from "~/Data/Interactions/InteractionsData";
import { Person, Company, Interactions } from "../NudgeInterfaces";
import { option } from "~/Util/fp/Instances/Option";
import { hasStrongTeamRelationship, hasTeamStrength, strengthOrderingToStrength, strengthToOrdering, RelationshipStrength } from "~/Data/Person/Relationship/relationshipData";
import { List } from "~/Util/fp/Instances/List";
import { toPairs, map as objMap, fromPairs } from "~/Util/fp/object";
import { Pair } from "~/Util/fp/Instances/Pair";
import { constant } from "~/Util/fp/function";

// enum AccountRisk {
//     slipping = "slipping",
//     noStrongRelationships = "noStrongRelationships",
//     singleThreaded = "singleThreaded",
//     missingExecs = "missingExecs",
//     weakenedExecs = "weakenedExecs",
// }
interface CommunicationSummary {
    allContact: Communication[];
    lastContact: Communication;
}
interface RelationshipsSummary {
    activeRelationships: number;
    strongRelationships: number;
}
interface ByUri<A> {
    [uri: string]: A;
}
type PeopleByUri = ByUri<Partial<Person>[]>;
type PeopleAndSummaryByUri = ByUri<Pair<Partial<Person>[], Record<string, any>>>;
interface AccountRelationshipsSummary {
    allRelationships: PeopleAndSummaryByUri;
    strongRelationships: PeopleAndSummaryByUri;
    weakenedRelationships: PeopleAndSummaryByUri;
}

export const getLastContact = (people: Partial<Person>[]): CommunicationSummary | undefined =>
    option.of(people)
        .map(getAllCommunications)
        .map(communications => ({
            allContact: communications,
            lastContact: getLastCommunication(communications)
        }))
        .getOrElse(() => undefined);

export const getTeamRelationshipSummary = (entity: Partial<Company> | Partial<Person>): RelationshipsSummary =>
    option.of(entity.teamInteractions)
        .chain(interactions => option.of((activeRelationships: number) => (strongRelationships: number) => ({ activeRelationships, strongRelationships }))
            .ap(option.of(interactions.activeRelationships))
            .ap(option.of(interactions.strongRelationships)))
        .getOrElse(() => ({ activeRelationships: 0, strongRelationships: 0 }));

type CombinedInteractionsPerson = Partial<Person> & { allInteractions: Interactions[] };
const combineInteractions = (people: Partial<Person>[]) =>
    people.reduce<CombinedInteractionsPerson>(
        (acc, { teamInteractions, ...restPerson }) => option.of(teamInteractions)
            .map(interactions => ({ ...restPerson, allInteractions: acc.allInteractions.concat(interactions) }))
            .getOrElse(() => acc),
        { allInteractions: [] });

interface TeamStrength {
    strength: RelationshipStrength;
    maxStrength: RelationshipStrength;
}
type CombinedStrengthsPerson = Partial<Person> & { teamStrength: TeamStrength };
const summarizePeople = <A>(f: (people: Partial<Person>[]) => A) => (peopleByUri: PeopleByUri) =>
    toPairs(peopleByUri)
        .map(pairs => pairs
            .map(people => Pair.of(f(people), people)));

const getMaxStrengths = (people: Partial<Person>[]) =>
    people.map(p => option.of(p.teamInteractions)
        .chain(interactions => option.of(interactions.strength)
            .chain(strength => option.of(interactions.maxStrength)
                .map(maxStrength => Pair.of(strength, maxStrength)
                    .bimap(strengthToOrdering, strengthToOrdering))))
        .getOrElse(() => Pair.of(RelationshipStrength.none, RelationshipStrength.none).bimap(strengthToOrdering, strengthToOrdering)))
        .reduce(
            (acc, strengths) => Pair.of(Math.max(strengths.fst(), acc.fst()), Math.max(strengths.snd(), acc.snd())),
            Pair.of(RelationshipStrength.none, RelationshipStrength.none).bimap(strengthToOrdering, strengthToOrdering));

type SummaryPeople = Pair<string,Pair<Record<string,any>,Partial<Person>[]>>;
const personUri = (p: Partial<Person>) => p.uri || "";
export const getTeamAccountRelationshipSummary = (people: Partial<Person>[]) =>
    option.of(List.fromArray(people))
        .chain(people => option.of(
            (allRelationships: SummaryPeople[]) => (strongRelationships: SummaryPeople[]) => (weakenedRelationships: SummaryPeople[]) =>
                ({ allRelationships, strongRelationships, weakenedRelationships }))
            .ap(option.of(people.filter(hasTeamStrength.run).groupBy(personUri))
                .map(summarizePeople(constant({}))))
            .ap(option.of(people.filter(hasStrongTeamRelationship.run).groupBy(personUri))
                .map(summarizePeople(constant({}))))
            .ap(option.of(people.groupBy(personUri))
                .map(summarizePeople(getMaxStrengths))
                .map(peoplePairs => peoplePairs
                    .filter(personPair => personPair.snd().fst().fst() !== personPair.snd().fst().snd())
                    .map(personPair => personPair.map(summaryPerson => summaryPerson
                        .merge((strengths, people) => Pair.of(
                            strengths
                                .bimap(strengthOrderingToStrength, strengthOrderingToStrength)
                                .merge((strength, maxStrength) => ({ strength, maxStrength })),
                            people)))))))
        .map(objMap((_, arr) => arr.map(byUri => byUri.map(summaryPerson => summaryPerson.map(combineInteractions)))))
        .map(objMap((uri, pairs) => fromPairs(pairs.map(pair => pair.map(summaryPerson => summaryPerson.merge((summary, person) => ({ summary, person })))))))
        .getOrElse(() => ({ allRelationships: {}, strongRelationships: {}, weakenedRelationships: {} }));
