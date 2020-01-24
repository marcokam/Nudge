import { IPersonIdentity, ICompanyIdentity } from "../NudgeInterfaces";
export declare enum IdentityType {
    teams = "teams",
    email = "email",
    domain = "domain",
    linkedin = "linkedin",
    twitter = "twitter",
    facebook = "facebook",
    none = "none"
}
export declare enum IdentityOrdering {
    teams = 1,
    email = 2,
    domain = 3,
    linkedin = 4,
    twitter = 5,
    facebook = 6,
    none = 7
}
export declare type Identity = IPersonIdentity | ICompanyIdentity;
export declare const sortAndFilterIdentities: (identities: Identity[]) => Identity[];
