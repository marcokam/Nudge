import { idToUri, uriToId } from "~/Uris/uriUtils";

export const peopleUri = `/v2/people`;
export const personIdToUri = idToUri(peopleUri);

export const personListsUri = `${peopleUri}/lists`;
export const personTweetsUri = (personUri: string) => `${personUri}/tweets`;
export const personMentionsUri = (personUri: string) => `${personUri}/mentions`;
export const personLastCommunicationsUri = (personUri: string) => `${personUri}/lastcommunications`;
export const personNotesUri = (personUri: string) => `${personUri}/notes`;
export const personExperienceUri = (personUri: string) => `${personUri}/experience`;
export const personIntroCollabsUri = (personUri: string) => `/api/AggregateConnection/GetConnectionPathway/${uriToId(personUri).getOrElse(() => "")}/false/true/any,my`;
