import { idToUri, uriToId } from "./uriUtils";
export var peopleUri = "/v2/people";
export var personIdToUri = idToUri(peopleUri);
export var personListsUri = peopleUri + "/lists";
export var personTweetsUri = function (personUri) { return personUri + "/tweets"; };
export var personMentionsUri = function (personUri) { return personUri + "/mentions"; };
export var personLastCommunicationsUri = function (personUri) { return personUri + "/lastcommunications"; };
export var personNotesUri = function (personUri) { return personUri + "/notes"; };
export var personExperienceUri = function (personUri) { return personUri + "/experience"; };
export var personIntroCollabsUri = function (personUri) { return "/api/AggregateConnection/GetConnectionPathway/" + uriToId(personUri).getOrElse(function () { return ""; }) + "/false/true/any,my"; };
//# sourceMappingURL=peopleUris.js.map