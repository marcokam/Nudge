import { NudgeUris } from "@nudge/client-sdk/Uris/NudgeUris";

import { getEntity } from "~/App/Utils/apiUtils.js";

export const getCompanyTeamConversations = (companyUri, teamUri, conversationDays, cache) => 
    getEntity(NudgeUris.v2.companies(companyUri).teamActivity(teamUri).userconversationswithaggs(conversationDays), {}, { cache });