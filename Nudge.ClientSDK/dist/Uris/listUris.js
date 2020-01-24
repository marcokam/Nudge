import { idToUri } from "./uriUtils";
import { personListsUri } from "./peopleUris";
import { companyListsUri } from "./companyUris";
export var personListIdToUri = idToUri(personListsUri);
export var companyListIdToUri = idToUri(companyListsUri);
export var listNetworkCollaboratorsUri = function (listUri) { return listUri + "/networks/collaborators"; };
export var listNetworkMembersUri = function (listUri) { return listUri + "/networks/members"; };
//# sourceMappingURL=listUris.js.map