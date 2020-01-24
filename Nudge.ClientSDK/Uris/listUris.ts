import { idToUri } from "~/Uris/uriUtils";
import { personListsUri } from "./peopleUris";
import { companyListsUri } from "./companyUris";

export const personListIdToUri = idToUri(personListsUri);
export const companyListIdToUri = idToUri(companyListsUri);

export const listNetworkCollaboratorsUri = (listUri: string) => `${listUri}/networks/collaborators`;
export const listNetworkMembersUri = (listUri: string) => `${listUri}/networks/members`;
