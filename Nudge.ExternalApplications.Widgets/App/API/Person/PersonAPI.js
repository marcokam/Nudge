import { uriToID } from "~/App/Utils/uriUtils.js";

/**
 * Main app urls
 */
export const personUrl = personUri => `/contactProfilePage?id=${uriToID(personUri)}`;
