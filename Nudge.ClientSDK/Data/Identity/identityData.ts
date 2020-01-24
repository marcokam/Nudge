import { compose } from "~/Util/fp/function";
import { numCompareByDir } from "~/Util/sortUtils";
import { propOr } from "~/Util/fp/object";
import { IPersonIdentity, ICompanyIdentity } from "../NudgeInterfaces";
import NudgeIterable from "~/Util/NudgeIterable";
import { Compare } from "~/Util/fp/Instances/Compare";


export enum IdentityType {
    teams = "teams",
    email = "email",
    domain = "domain",
    linkedin = "linkedin",
    twitter = "twitter",
    facebook = "facebook",
    none = "none",
}
export enum IdentityOrdering {
    teams = 1,
    email = 2,
    domain = 3,
    linkedin = 4,
    twitter = 5,
    facebook = 6,
    none = 7,
}

export type Identity = IPersonIdentity | ICompanyIdentity;

export const sortAndFilterIdentities = (identities: Identity[]) =>
    NudgeIterable.fromArray(identities)
        .uniqBy(compose(
            (t: IdentityType) => t.toLowerCase(),
            propOr("type", ""),
        ))
        .toArray()
        .sort(Compare.of(numCompareByDir(true))
            .contramap(compose(
                (t: IdentityType) => IdentityOrdering[t] || Infinity,
                propOr("type", ""),
            ))
            .run)
