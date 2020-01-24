import { idToUri } from "./uriUtils";
export var companiesUri = "/v2/companies";
export var companyUri = "/v2/company";
export var companyIdToUri = idToUri(companiesUri);
export var companyListsUri = companiesUri + "/lists";
export var companyNetworkCollaboratorsUri = function (companyUri) { return companyUri + "/networks/collaborators"; };
export var companyNetworkMembersUri = function (companyUri) { return companyUri + "/networks/members"; };
//# sourceMappingURL=companyUris.js.map