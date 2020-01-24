import { idToUri } from "~/Uris/uriUtils";

export const companiesUri = `/v2/companies`;
export const companyUri = `/v2/company`;
export const companyIdToUri = idToUri(companiesUri);

export const companyListsUri = `${companiesUri}/lists`;
export const companyNetworkCollaboratorsUri = (companyUri: string) => `${companyUri}/networks/collaborators`;
export const companyNetworkMembersUri = (companyUri: string) => `${companyUri}/networks/members`;