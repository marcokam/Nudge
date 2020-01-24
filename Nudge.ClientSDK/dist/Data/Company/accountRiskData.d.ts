import { Communication } from "../Interactions/InteractionsData";
import { Person, Company, Interactions } from "../NudgeInterfaces";
interface CommunicationSummary {
    allContact: Communication[];
    lastContact: Communication;
}
interface RelationshipsSummary {
    activeRelationships: number;
    strongRelationships: number;
}
export declare const getLastContact: (people: Partial<Person>[]) => CommunicationSummary | undefined;
export declare const getTeamRelationshipSummary: (entity: Partial<Person> | Partial<Company>) => RelationshipsSummary;
declare type CombinedInteractionsPerson = Partial<Person> & {
    allInteractions: Interactions[];
};
export declare const getTeamAccountRelationshipSummary: (people: Partial<Person>[]) => Record<string, Record<string, {
    summary: Record<string, any>;
    person: CombinedInteractionsPerson;
}>> | {
    allRelationships: {};
    strongRelationships: {};
    weakenedRelationships: {};
};
export {};
