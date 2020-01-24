import React from "react";
import { Person, Interactions } from "../../Data/NudgeInterfaces";
import { PersonProfileProps } from "../Company/OrgChart/OrgChart";
interface TeamInteractionProps {
    interactions: Interactions;
    PersonProfile: React.FunctionComponent<PersonProfileProps>;
    person: Partial<Person>;
}
export declare const TeamInteractions: React.FunctionComponent<TeamInteractionProps>;
export {};
