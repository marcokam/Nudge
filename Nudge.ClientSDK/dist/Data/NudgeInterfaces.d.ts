import * as Nudge from "./Nudge";
import { RelationshipStrength } from "./Person/Relationship/relationshipData";
import { JobLevel } from "./Person/Level/jobLevelData";
export declare enum CardFundingType {
    credit = 1,
    debit = 2,
    prepaid = 3
}
export interface ICompanyAccount extends Nudge.IRoutable {
    companyAccountId: number;
    companyName?: string;
    createDate: Date;
    updateDate: Date;
    trialExpiryDate?: Date;
    planExpiryDate?: Date;
    teams?: ITeam[];
    totalFreeLicenseCount: number;
    totalInvoicedLicenseCount: number;
    totalCreditCardLicenseCount: number;
    freeLicenseCountInUse: number;
    creditCardLicenseCountInUse: number;
    invoiceLicenseCountInUse: number;
    productLevel: CompanyAccountProductLevel;
    status: CompanyAccountStatus;
    licenses?: ICompanyAccountLicense[];
    paymentPlanId?: number;
    paymentPlan?: ICompanyAccountPaymentPlan;
    stripePaymentDetails?: ICompanyAccountStripePaymentDetail[];
    syncs?: ICompanyAccountSync[];
    stripeCustomerId?: string;
    stripeTokenId?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    couponCode?: string;
    requiresConfiguration: boolean;
}
export interface ICompanyAccountLicense extends Nudge.IRoutable {
    emailAddress?: string;
    userId?: number;
    user?: IUser;
    createDate: Date;
    updateDate: Date;
    renewalDate?: Date;
    licenseRole: CompanyAccountLicenseRole;
    isFree: boolean;
    paymentStatus: PaymentType;
    pauseReactivationOrder: number;
    pauseDate?: Date;
    expiryDate?: Date;
    licenseStatus: CompanyAccountLicenseStatus;
    companyAccountId: number;
    companyAccount?: ICompanyAccount;
    companyAccountLicenseId: number;
    isPrimary: boolean;
    isConfigured: boolean;
}
export declare enum CompanyAccountLicenseRole {
    user = 1,
    manager = 2,
    administrator = 3
}
export declare enum CompanyAccountLicenseStatus {
    active = 1,
    pausedManually = 2,
    pausedAutomatically = 3,
    cancellationPending = 4,
    notEnabled = 5
}
export interface ICompanyAccountPaymentPlan extends Nudge.IRoutable {
    paymentPlanName?: string;
    timeUnit: number;
    renewalDuration: number;
    payment: number;
    productLevel: CompanyAccountProductLevel;
    stripePlanId?: string;
    companyAccountPaymentPlanID: number;
    minimumLicenseQuantity: number;
}
export declare enum CompanyAccountProductLevel {
    team = 2,
    enterprise = 3,
    professional = 4
}
export declare enum CompanyAccountStatus {
    active = 1,
    trialEnded = 2,
    pastDue = 3,
    canceled = 4,
    deleted = 5,
    cancellationPending = 6
}
export interface ICompanyAccountStripePaymentDetail extends Nudge.IRoutable {
    expiryMonth: number;
    expiryYear: number;
    cardFundingType: CardFundingType;
    creditCardType: CreditCardType;
    isCreditCardValid: boolean;
    failureCode?: string;
    companyAccountId: number;
    companyAccount?: ICompanyAccount;
    isSelected: boolean;
    cardholderName?: string;
    cardCountry?: string;
    cardLast4Digits?: string;
    stripeTokenId?: string;
    stripeCardId?: string;
    companyAccountStripePaymentDetailId: number;
}
export interface ICompanyAccountSync {
    externalSystemId?: string;
    externalSystemName?: string;
    externalSystemType: number;
    createdAt: Date;
    isVerified: boolean;
    isCentral: boolean;
}
export interface ICompanyIdentity {
    externalUrl?: string;
    identity?: string;
    type?: CompanyIdentityTypeEnum;
}
export declare enum CompanyIdentityTypeEnum {
    facebook = 1001,
    domain = 1003,
    name = 1005,
    ticker = 1006,
    twitter = 1007,
    linkedin = 1008
}
export declare enum CreditCardType {
    visa = 1,
    masterCard = 2,
    americanExpress = 3,
    discover = 4,
    dinersClub = 5,
    jcb = 6
}
export declare enum FlaggedDataTypeEnum {
    personName = 1,
    personDuplicate = 2,
    personImage = 3,
    personBadMerge = 4,
    personBadData = 5,
    personMergeReview = 6,
    personDataFromUser = 7,
    companyDuplicate = 102,
    companyBadMerge = 103,
    companyName = 104,
    companyBadData = 105,
    companyMergeReview = 106
}
export interface IJobRole extends Nudge.IRoutable {
    name?: string;
    parent?: IJobRole;
    parentUri?: string;
}
export interface ILocality {
    lat: number;
    lon: number;
    cty?: string;
    stt?: string;
    cnt?: string;
}
export interface ILocationDetail {
    adr?: string;
    pst?: string;
    locality?: ILocality;
}
export interface INetworkHealthScore {
    strong: number;
    active: number;
    total?: number;
    date: Date;
    status: NetworkHealthStatus;
}
export declare enum NetworkHealthStatus {
    unknown = 0,
    known = 1,
    processing = 2
}
export declare enum PaymentType {
    free = 1,
    invoiced = 2,
    creditCard = 3
}
export interface Interactions {
    activeRelationships?: number;
    strongRelationships?: number;
    introStrength?: RelationshipStrength;
    lastInbound?: string;
    lastInboundTeamMember?: Partial<Person>;
    lastInboundPerson?: Partial<Person>;
    lastOutbound?: string;
    lastOutboundTeamMember?: Partial<Person>;
    lastOutboundPerson?: Partial<Person>;
    lastMeeting?: string;
    lastMeetingTeamMember?: Partial<Person>;
    lastMeetingPerson?: Partial<Person>;
    nextMeeting?: string;
    nextMeetingTeamMember?: Partial<Person>;
    nextMeetingPerson?: Partial<Person>;
    strengthTeamMember?: Partial<Person>;
    strength?: RelationshipStrength;
    maxStrength?: RelationshipStrength;
    strengthLost?: number;
}
export interface Company {
    uri: string;
    name: string;
    imageUrl: string;
    teamInteractions: Interactions;
    interactions: Interactions;
}
export interface Person {
    uri: string;
    name: string;
    title: string;
    imageUrl: string;
    identities: IPersonIdentity[];
    level: JobLevel;
    roles: IJobRole[];
    teamInteractions: Interactions;
    interactions: Interactions;
}
export interface IPersonIdentity {
    externalUrl?: string;
    identity?: string;
    type?: PersonIdentityTypeEnum;
}
export declare enum PersonIdentityTypeEnum {
    internaluser = 0,
    email = 1,
    twitter = 2,
    linkedin = 3,
    facebook = 4,
    googleplus = 5,
    instagram = 6,
    pinterest = 7,
    phonenumber = 8,
    externaldatasource = 10,
    encryptedemail = 11,
    standarddata = 12,
    crunchbase = 1004,
    unknown = -1
}
export interface IStandardTimeZone {
    stnNam?: string;
    stnNamOff?: string;
    posOff: boolean;
    hrsOff: number;
    minOff: number;
    stnTmeZneId: number;
}
export interface ITeam extends Nudge.IRoutable {
    teamName?: string;
    description?: string;
    type: TeamType;
    companyAccountId: number;
    companyAccount?: ICompanyAccount;
    teamMemberCount: number;
    teamMembers?: ITeamMember[];
    imageUrl?: string;
    teamId: number;
}
export declare enum TeamCapabilityType {
    contributor = 1,
    manager = 2,
    reporting = 4
}
export interface ITeamInvite extends Nudge.IRoutable {
    teamId: number;
    team?: ITeam;
    userIdA: number;
    userA?: IUser;
    userIdB?: number;
    userB?: IUser;
    inviteRecipientEmail?: string;
    inviteDate: Date;
    inviteText?: string;
    inviteCount: number;
    inviteStatus: TeamInviteStatus;
    teamInviteId: number;
}
export declare enum TeamInviteStatus {
    invited = 1,
    accepted = 2,
    ignored = 3,
    cancelled = 4,
    awaitingMatch = 5,
    awaitingLicense = 6
}
export interface ITeamMember extends Nudge.IRoutable {
    teamId: number;
    teamName?: string;
    team?: ITeam;
    createDate: Date;
    updateDate: Date;
    teamInviteId?: number;
    teamInvite?: ITeamInvite;
    userId: number;
    user?: IUser;
    userName?: string;
    activeStatus: TeamMemberActiveStatus;
    companyAccountLicenseId: number;
    companyAccountLicense?: ICompanyAccountLicense;
    capabilities: TeamCapabilityType;
    teamMemberId: number;
}
export declare enum TeamMemberActiveStatus {
    active = 1,
    awaitingLicense = 2,
    awaitingInvite = 3
}
export declare enum TeamType {
    publicTeam = "publicTeam",
    privateTeam = "privateTeam",
    companyTeam = "companyTeam",
    systemTeam = "systemTeam",
    personalTeam = "personalTeam"
}
export interface IUser {
    usrIdn: number;
    usrSIdns?: string;
    userName?: string;
    usrDspNam?: string;
    usrFstNam?: string;
    usrLstNam?: string;
    usrEml?: string;
    crtDte: Date;
    crtDteUnx: number;
    tmeZneId?: number;
    tmeZne?: IStandardTimeZone;
    updEml: boolean;
    locDetId?: number;
    locDet?: ILocationDetail;
    jobTtl?: string;
    cmpNam?: string;
    usrImgUrl?: string;
    networkHealthScore?: INetworkHealthScore;
    isTstUsr: boolean;
    isAnalyticsUser: boolean;
    updateIsAnalyticsUser: boolean;
    ntfEml?: string;
    aggId?: number;
}
export interface IUserFlaggedData extends Nudge.IRoutable {
    person1?: Person;
    person2?: Person;
    company1?: Company;
    company2?: Company;
    user?: IUser;
    createDate: Date;
    note?: string;
    replyNote?: string;
    secondaryData?: string;
    invalidName?: string;
    nonPersonIdentity?: string;
    status: UserFlaggedDataStatusEnum;
    type: FlaggedDataTypeEnum;
}
export declare enum UserFlaggedDataStatusEnum {
    flagged = 1,
    rejected = 2,
    complete = 3
}
