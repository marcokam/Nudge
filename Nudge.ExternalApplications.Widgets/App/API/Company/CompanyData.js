
import { getEntity } from "@nudge/client-sdk/Util/apiUtils";
import { Task } from "@nudge/client-sdk/Util/fp/Instances/Task";
import { option } from "@nudge/client-sdk/Util/fp/Instances/Option";
import { optHead } from "@nudge/client-sdk/Util/fp/array";
import { NudgeUris } from "@nudge/client-sdk/Uris/NudgeUris";

export const getCompanyByIdentity = (companyIdentity, queryOverrides, getEntityOptions) =>
    getEntity(NudgeUris.v2.companies()._uri, {
        q: `identity:${companyIdentity}`,
        fields: "uri,name,imageUrl",
        ...queryOverrides,
    }, getEntityOptions)
        .map(option.of)
        .map(optCompanies => optCompanies.chain(optHead))
        .chain(optFirstCompany => Task.fromOption(optFirstCompany, {}));
        