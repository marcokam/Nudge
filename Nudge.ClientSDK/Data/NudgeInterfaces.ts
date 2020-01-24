import * as Nudge from "./Nudge";
import { RelationshipStrength } from "~/Data/Person/Relationship/relationshipData";
import { JobLevel } from "~/Data/Person/Level/jobLevelData";

// export enum AggregateBucketEntityType {
//     Url = 0,
//     Hashtag = 1,
//     Mention = 2
// }
// export interface IAggregateBucketEventsAnalysisResult {
//     numberOfUses: number;
//     entityType: AggregateBucketEntityTypenumber;
//     entityValue?: stringnumber;
//     eventDetails?: IEvent[]number;
//     contentDetails?: ITweetContent
// }
// export enum AggregateBucketEventType {
//     Tweet = 0
// }
// export interface IAggregateConversationSummary {
//     outreachCount: boolean;
//     response: boolean;
//     person?: IPerson;
// }
// export interface IAggregateConversationSummaryNew {
//     mostRecentEmailInbound?: Date;
//     mostRecentEmailOutbound?: Date;
//     mostRecentMeeting?: Date;
//     person?: IPerson;
// }
// export enum AggregateSuggestedEditType {
//     WrongCompany = 1,
//     WrongTitle = 2,
//     WrongLinks = 4,
//     Other = 8,
//     WrongImage = 16
// }
// export enum AnswerStatusEnum {
//     open = 0,
//     answered = 1,
//     nullAnswer = 2,
//     noneAnswer = 3
// }
// export interface IAnswerSuggestion {
//     answerSuggestionId: number;
//     valueText?: string;
//     yesNoValue: boolean;
//     imageUrl?: string;
//     primaryDisplayText?: string;
//     secondaryDisplayText?: string;
//     locationText?: string;
//     displayUrl?: string;
// }
// export enum BadgeReasonEnum {
//     todoSet = 1,
//     rareActivity = 2,
//     losingTouch = 3,
//     recentEmail = 11,
//     recentMeeting = 12,
//     matchedInterests = 13,
//     pinnedList = 14,
//     matchedEvents = 15,
//     profileView = 21,
//     newsExecutiveChange = 1001,
//     newsAcquisitionMerger = 1002,
//     newsLayOff = 1003,
//     newsGrowth = 1004,
//     newsNewProduct = 1005,
//     newsInitiative = 1006,
//     newsScandal = 1007,
//     newsPartnership = 1008,
//     newsAward = 1009,
//     newsEvent = 1010,
//     newsNegativeEarning = 1011,
//     newsPositiveEarning = 1012,
//     newsEarning = 1013,
//     newsContentMarketing = 1014,
//     newsFunding = 1015,
//     newsDivestiture = 1016,
//     newsIpo = 1017,
//     newsFinancial = 1018,
//     newsAnalystActivity = 1019,
//     newsBankruptcy = 1020,
//     newsMarketReports = 1021,
//     newsInsiderTrading = 1022,
//     newsStockNews = 1023,
//     newsLegal = 1024,
//     newsPolitics = 1025
// }
// export interface IBusinessNote extends Nudge.IRoutable {
//     businessNoteId: number;
//     createDate: Date;
//     updateDate: Date;
//     lastUseDate?: Date;
//     note?: string;
//     noteName?: string;
//     sourceUser?: IUser;
//     scenario: BusinessNoteScenarioType;
//     personList?: IPersonList;
//     companyList?: ICompanyList;
//     customization?: IBusinessNoteCustomization;
//     accesses?: IBusinessNoteAccess[];
//     usageSummaries?: IBusinessNoteUsageSummary[];
// }
// export interface IBusinessNoteAccess extends Nudge.IRoutable {
//     accessId: number;
//     businessNoteId: number;
//     user?: IUser;
//     team?: ITeam;
// }
// export interface IBusinessNoteCustomization extends Nudge.IRoutable {
//     enabled: boolean;
//     scenario?: BusinessNoteScenarioTypeboolean;
//     personList?: IPersonListboolean;
//     companyList?: ICompanyList;
// }
// export interface IBusinessNoteFields {

// }
// export enum BusinessNoteScenarioType {
//     user = 0,
//     initialOutreach = 1,
//     followupOutreach = 2,
//     introduction = 3,
//     personMention = 4,
//     companyMention = 5,
//     personTweet = 6,
//     marketingEvent = 7,
//     segmentFit = 8,
//     definedPersonList = 9,
//     definedCompanyList = 10
// }
// export interface IBusinessNoteUsageSummary {
//     user?: IUser;
//     usageCount: number;
//     lastUsedDate: Date;
// }
export enum CardFundingType {
    credit = 1,
    debit = 2,
    prepaid = 3
}
// export enum CollaborationTypeEnum {
//     User = 0,
//     Team = 1,
//     UserAndTeam = 2,
//     Self = 3
// }
// export interface ICollaboratorRecommendation extends Nudge.IRoutable {
//     user?: IUser;
//     person?: IPerson;
//     strength?: RelationshipStrength;
//     maxStrength?: RelationshipStrength;
//     strength2?: RelationshipStrength;
//     maxStrength2?: RelationshipStrength;
//     status: RecommendationStatusEnum;
// }
// export enum CommunicationDateRange {
//     day = 0,
//     week = 1
// }
// export enum CommunicationMedium {
//     email = 0,
//     linkedin = 1,
//     facebook = 2,
//     twitterMention = 3,
//     meeting = 4,
//     mediumMeeting = 5,
//     largeMeeting = 6,
//     hugeMeeting = 7,
//     twitterDirectMessage = 8,
//     twitterRetweet = 9,
//     twitterFavorite = 10,
//     sms = 11,
//     phoneCall = 12,
//     internal = 13
// }
// export interface ICompaniesListExport extends Nudge.IRoutable {
//     createDate: Date;
//     processed: number;
// }
// export interface ICompaniesListUpload extends Nudge.IRoutable {
//     createDate: Date;
//     name?: string;
//     processed: number;
//     unprocessed: number;
//     userDisplayName?: string;
// }
// export interface ICompany extends Nudge.IRoutable {
//     name?: string;
//     imageUrl?: string;
//     description?: string;
//     employees?: number;
//     revenue?: number;
//     industries?: IIndustry[];
//     address?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     location?: string;
//     completeness?: number;
//     activeRelationships?: number;
//     strongRelationships?: number;
//     introConnections?: number;
//     strength?: RelationshipStrength;
//     introStrength?: RelationshipStrength;
//     strength2?: RelationshipStrength;
//     introStrength2?: RelationshipStrength;
//     identities?: ICompanyIdentity[];
// }
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
// export interface ICompanyAccountAccessRestriction {
//     companyAccountLoginDomains?: ICompanyAccountLoginDomain[];
//     companyAccountLoginTenants?: ICompanyAccountLoginTenant[];
//     companyAccountExternalSystemRestrictions?: ICompanyAccountExternalSystemRestriction[];
// }
// export interface ICompanyAccountAdministrator {
//     name?: string;
//     emailAddress?: string;
// }
// export interface ICompanyAccountAndTeam {
//     companyName?: string,
//     teamName?: string,
//     inviteeEmailAddresses?: string[]
// }
// export interface ICompanyAccountApiKey extends Nudge.IRoutable {
//     apiGuid: string,
//     friendlyName?: string
// }
// export interface ICompanyAccountExternalSystemRestriction {
//     externalSystemType: number
// }
// export interface ICompanyAccountHiddenDomain {
//     domain?: string
// }
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
export enum CompanyAccountLicenseRole {
    user = 1,
    manager = 2,
    administrator = 3
}
export enum CompanyAccountLicenseStatus {
    active = 1,
    pausedManually = 2,
    pausedAutomatically = 3,
    cancellationPending = 4,
    notEnabled = 5
}
// export interface ICompanyAccountLicenseStatusRequest {
//     licenseStatus: CompanyAccountLicenseStatus,
//     licenseIds?: number[]
// }
// export interface ICompanyAccountLoginDomain {
//     externalSystemType: number,
//     domain?: string
// }
// export interface ICompanyAccountLoginTenant {
//     externalSystemType: number,
//     tenantID?: string
// }
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
export enum CompanyAccountProductLevel {
    team = 2,
    enterprise = 3,
    professional = 4
}
export enum CompanyAccountStatus {
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
// export interface ICompanyAccountSyncCredentials {
//     externalSystemType: number,
//     userName?: string,
//     userPrincipalName?: string,
//     password?: string,
//     appId?: string,
//     domain?: string,
//     certFile?: string,
//     isSandbox: boolean
// }
// export interface ICompanyAccountSyncUser {
//     userId: number,
//     userDisplayName?: string,
//     emailAddress?: string,
//     status: CompanyAccountSyncUserStatus
// }
// export enum CompanyAccountSyncUserStatus {
//     Connected = 1,
//     Disconnected = 2,
//     Unmanaged = 3
// }
// export interface ICompanyCurrentConversation {
//     companyId: number,
//     name?: string,
//     outreachCount: number,
//     responseCount: number,
//     bothCount: number,
//     eitherCount: number,
//     interactionList?: IUser[]
// }
// export interface ICompanyFamily extends Nudge.IRoutable {
//     name?: string,
//     familyMembers?: ICompanyFamilyMember[],
//     updateDate: Date,
//     status: number,
//     primaryAggId: number
// }
// export interface ICompanyFamilyMember extends Nudge.IRoutable {
//     CompanyFamily?: ICompanyFamily,
//     companyId: number,
//     company?: ICompany,
//     isPrimary: boolean,
//     createDate?: Date
// }
export interface ICompanyIdentity {
    externalUrl?: string;
    identity?: string;
    type?: CompanyIdentityTypeEnum;
}
export enum CompanyIdentityTypeEnum {
    facebook = 1001,
    domain = 1003,
    name = 1005,
    ticker = 1006,
    twitter = 1007,
    linkedin = 1008
}
// export interface ICompanyList extends Nudge.IRoutable {
//     subscriptions?: ICompanyListSubscription[],
//     cadences?: ICompanyListCadence[],
//     capabilities?: ICompanyListCapability[],
//     accesses?: ICompanyListAccess[],
//     news?: ICompanyListNews[],
//     socials?: ICompanyListSocial[],
//     communications?: ICompanyListCommunication[],
//     name?: string,
//     type: ListType,
//     owner?: IUser,
//     accessibility: ListAccessibilityType,
//     subscriberCount?: number,
//     memberCount?: number,
//     source: ListSourceType,
//     networkHealth?: INetworkHealthScore,
//     status?: string,
//     highlights?: string[]
// }
// export interface ICompanyListAccess extends Nudge.IRoutable {
//     user?: IUser,
//     team?: ITeam,
//     teamLeadership?: boolean,
//     collaborators?: boolean
// }
// export interface ICompanyListCadence extends Nudge.IRoutable {
//     type: ListCadenceType,
//     status?: ListCadenceStatusType,
//     outstanding?: number,
//     completed?: number,
//     ignored?: number
// }
// export interface ICompanyListCapability extends Nudge.IRoutable {
//     user?: IUser,
//     capability: ListCapabilityType
// }
// export interface ICompanyListChange extends Nudge.IRoutable {
//     identityType?: string,
//     identityValue?: string,
//     name?: string,
//     description?: string,
//     listId: number,
//     listUri?: string,
//     addToList: boolean
// }
// export interface ICompanyListCommunication extends Nudge.IRoutable {
//     company?: ICompany,
//     person?: IPerson,
//     type?: CommunicationMedium,
//     range?: CommunicationDateRange,
//     date?: Date
// }
// export interface ICompanyListHighlight extends Nudge.IRoutable {
//     newsItem?: ICompanyListNews,
//     socialItem?: ICompanyListSocial,
//     source: HighlightSourceTypeEnum,
//     score: number,
//     date: Date,
//     reasons?: IHighlightReason[],
//     interactions?: IHighlightInteraction[]
// }
// export interface ICompanyListMember extends Nudge.IRoutable {
//     company?: ICompany,
//     hidden?: boolean
// }
// export interface ICompanyListMemberRecommendation extends Nudge.IRoutable {
//     company?: ICompany,
//     user?: IUser,
//     status: RecommendationStatusType
// }
// export interface ICompanyListNetworkCollaborator extends Nudge.IRoutable {
//     user?: IUserWithEmail,
//     people?: IPerson[],
//     peopleCount?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     companies?: ICompany[],
//     companyCount?: number,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface ICompanyListNetworkHealth extends Nudge.IRoutable {
//     user?: IUser,
//     team?: ITeam,
//     all: boolean,
//     networkHealth?: INetworkHealthScore
// }
// export interface ICompanyListNetworkInactiveCollaborator extends Nudge.IRoutable {
//     user?: IUserWithEmail,
//     people?: IPerson[],
//     peopleCount?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     companies?: ICompany[],
//     companyCount?: number,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface ICompanyListNetworkMember extends Nudge.IRoutable {
//     users?: IUserWithEmail[],
//     userCount?: number,
//     person?: IPerson,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     company?: ICompany,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface ICompanyListNews extends Nudge.IRoutable {
//     companyMember?: ICompanyListMember,
//     people?: IPerson[],
//     nudgeTopic?: INudgeTopic,
//     seen: boolean,
//     badges?: BadgeReasonEnum[],
//     subjects?: ISubject[]
// }
// export interface ICompanyListOutreach extends Nudge.IRoutable {
//     cadence1Week: number,
//     cadence2Weeks: number,
//     cadence3Weeks: number,
//     cadence1Month: number,
//     cadence3Months: number,
//     cadence6Months: number,
//     cadence12Months: number,
//     cadenceOlder: number
// }
// export interface ICompanyListRecommendation extends Nudge.IRoutable {
//     list?: ICompanyList,
//     status: RecommendationStatusEnum
// }
// export interface ICompanyListSearchSnapshot extends Nudge.IRoutable {
//     list?: ICompanyList,
//     name?: string,
//     query?: string,
//     frequency: number,
//     limit: number
// }
// export interface ICompanyListSocial extends Nudge.IRoutable {
//     companyMember?: ICompanyListMember,
//     tweet?: ITweet,
//     seen: boolean,
//     badges?: BadgeReasonEnum[]
// }
// export interface ICompanyListSocialTrend extends Nudge.IRoutable {
//     numberOfUses: number,
//     entityType: ListSocialTrendType,
//     entityValue?: string,
//     eventDetails?: ITrendingEvent[],
//     contentDetails?: ITweetContent
// }
// export interface ICompanyListStreak extends Nudge.IRoutable {
//     currentStreak: number,
//     maxStreak: number,
//     currentWeeklyStreak: number,
//     maxWeeklyStreak: number
// }
// export interface ICompanyListSubscription extends Nudge.IRoutable {
//     list?: ICompanyList,
//     user?: IUser,
//     subscription: ListSubscriptionType,
//     cadence: ListCadenceType,
//     isOnHomepage: boolean,
//     pinned: boolean
// }
// export interface ICompanyMention extends Nudge.IRoutable {
//     personId?: string,
//     companyId?: string,
//     person?: IPerson,
//     company?: ICompany,
//     nudgeTopic?: INudgeTopic,
//     highlight?: string,
//     available: boolean
// }
// export interface ICompanyNetworkCollaborator extends Nudge.IRoutable {
//     user?: IUserWithEmail,
//     people?: IPerson[],
//     peopleCount?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     companies?: ICompany[],
//     companyCount?: number,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface ICompanyNetworkMember extends Nudge.IRoutable {
//     users?: IUserWithEmail[],
//     userCount?: number,
//     person?: IPerson,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     company?: ICompany,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface ICompanyStatRanking {
//     companyId: number,
//     metricLastContact?: Date,
//     metricDsp?: string
// }
// export interface ICompanyTeamNhs {
//     companyId: number,
//     name?: string,
//     networkHealth?: INetworkHealthScore
// }
// export interface ICompanyWithRelationshipCount extends Nudge.IRoutable {
//     company?: ICompany,
//     relationshipCount: number
// }
// export interface IContentFeed extends Nudge.IRoutable {
//     contentFeedId: number,
//     feedUrl?: string,
//     type: ContentFeedTypeEnum,
//     lastRead?: Date,
//     lastContentItemUrl?: string,
//     lastContentItemDate?: Date,
//     status: number,
//     note?: string,
//     createUser?: IUser,
//     updateUser?: IUser,
//     createDate?: Date,
//     updateDate?: Date
// }
// export enum ContentFeedTypeEnum {
//     Rss = 1,
//     WordPress = 2
// }
// export interface IContentIngestionSource {
//     url?: string,
//     sourceType: ContentSourceType,
//     sourceIdentifier?: string,
//     title?: string,
//     publishDate?: Date,
//     description?: string,
//     imageUrl?: string
// }
// export interface IContentItem {
//     cntItmId: number,
//     cntUrl?: string,
//     cntTtl?: string,
//     crtDte: Date,
//     publishDate: Date,
//     cntDsc?: string,
//     cntDscNoHtml?: string,
//     cntImgUrl?: string,
//     updUsrId: number,
//     updUsrDtl?: IUser,
//     updDte: Date,
//     html?: string,
//     text?: string,
//     authors?: string[]
// }
// export interface IContentItemCompanyMention {
//     highlight?: string
// }
// export enum ContentItemEventEnum {
//     executiveChange = 1,
//     acquisitionMerger = 2,
//     layOff = 3,
//     growth = 4,
//     newProduct = 5,
//     initiative = 6,
//     scandal = 7,
//     partnership = 8,
//     award = 9,
//     event = 10,
//     negativeEarning = 11,
//     positiveEarning = 12,
//     earning = 13,
//     contentMarketing = 14,
//     funding = 15,
//     divestiture = 16,
//     ipo = 17,
//     financial = 18,
//     analystActivity = 19,
//     bankruptcy = 20,
//     marketReports = 21,
//     insiderTrading = 22,
//     stockNews = 23,
//     legal = 24,
//     politics = 25
// }
// export interface IContentItemPersonMention {
//     highlight?: string
// }
// export interface IContentItemSource {
//     sourceType: ContentSourceType,
//     sourceIdentifier?: string
// }
// export interface IContentItemText {
//     uri?: string,
//     text?: string
// }
// export interface IContentItemV2 extends Nudge.IRoutable {
//     contentItemId?: number,
//     contentUrl?: string,
//     publishDate?: Date,
//     peopleMentions?: IContentItemPersonMention[],
//     companiesMentions?: IContentItemCompanyMention[],
//     sources?: IContentItemSource[],
//     authors?: string[]
// }
// export enum ContentSourceType {
//     Unknown = 0,
//     Manual = 1,
//     Feed = 2,
//     Twitter = 3
// }
// export interface IContentUsage extends Nudge.IRoutable {
//     contentTitle?: string,
//     contentFeedUrl?: string,
//     useCount: number,
//     uniqueUseCount: number
// }
// export interface ICouponDetails {
//     percentOff?: number,
//     amountOff?: number,
//     durationType: DurationType,
//     durationInMonths?: number
// }
export enum CreditCardType {
    visa = 1,
    masterCard = 2,
    americanExpress = 3,
    discover = 4,
    dinersClub = 5,
    jcb = 6
}
// export enum DurationType {
//     forever = 0,
//     once = 1,
//     repeating = 2
// }
// export enum EditField {
//     Other = 0,
//     Image = 1,
//     TwitterUrl = 2,
//     LinkedInUrl = 3,
//     FacebookUrl = 4,
//     WebsiteUrl = 5,
//     Name = 7,
//     CompanyAssociation = 8,
//     Title = 9,
//     Logo = 10,
//     Description = 11,
//     Size = 12
// }
// export interface IEvent {
//     aggregateId?: string,
//     identityType: number,
//     identityValue?: string,
//     eventType: AggregateBucketEventType,
//     eventId?: string,
//     eventDate: Date
// }
// export interface IExternalCompanyIdentity {
//     identity?: string,
//     type?: CompanyIdentityTypeEnum
// }
// export interface IExternalCompanyList extends Nudge.IRoutable {
//     name?: string,
//     externalId?: string,
//     listUri?: string,
//     owner?: IUser,
//     memberImportDate?: Date,
//     memberRecalculationDate?: Date,
//     memberStatus?: ExternalListStatus
// }
// export interface IExternalCompanyListImport extends Nudge.IRoutable {
//     startedAt?: Date,
//     finishedAt?: Date,
//     status?: ImportStatus
// }
// export interface IExternalCompanyListMember extends Nudge.IRoutable {
//     details?: IExternalCompanyListMemberDetails,
//     metrics?: IExternalCompanyListMemberMetrics,
//     externalId?: string,
//     identities?: IExternalCompanyIdentity[]
// }
// export interface IExternalCompanyListMemberDetails {
//     city?: string,
//     state?: string,
//     country?: string,
//     logo?: string,
//     description?: string
// }
// export interface IExternalCompanyListMemberMetrics {
//     relationships?: number,
//     strongRelationships?: number,
//     lastContact?: Date,
//     multiple?: boolean
// }
// export interface IExternalCompanyListMemberPostExample extends Nudge.IRoutable {
//     details?: IExternalCompanyListMemberDetails,
//     metrics?: IExternalCompanyListMemberMetrics,
//     externalId?: string,
//     identities?: IExternalCompanyIdentity[]
// }
// export interface IExternalCompanyListPost extends Nudge.IRoutable {
//     name?: string,
//     externalId?: string,
//     listUri?: string,
//     owner?: IUser,
//     memberImportDate?: Date,
//     memberRecalculationDate?: Date,
//     memberStatus?: ExternalListStatus
// }
// export interface IExternalList {
//     id: number,
//     externalID?: string,
//     name?: string,
//     isEnabled: boolean
// }
// export enum ExternalListStatus {
//     processed = 0,
//     importing = 1,
//     calculating = 2
// }
// export interface IExternalPersonIdentity {
//     identity?: string,
//     type?: PersonIdentityTypeEnum
// }
// export interface IExternalPersonList extends Nudge.IRoutable {
//     name?: string,
//     externalId?: string,
//     listUri?: string,
//     owner?: IUser,
//     memberImportDate?: Date,
//     memberRecalculationDate?: Date,
//     memberStatus?: ExternalListStatus
// }
// export interface IExternalPersonListImport extends Nudge.IRoutable {
//     startedAt?: Date,
//     finishedAt?: Date,
//     status?: ImportStatus
// }
// export interface IExternalPersonListMember extends Nudge.IRoutable {
//     details?: IExternalPersonListMemberDetails,
//     externalId?: string,
//     identities?: IExternalPersonIdentity[]
// }
// export interface IExternalPersonListMemberDetails {
//     firstName?: string,
//     lastName?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     image?: string,
//     company?: string,
//     jobTitle?: string
// }
// export interface IExternalPersonListMemberPostExample extends Nudge.IRoutable {
//     details?: IExternalPersonListMemberDetails,
//     externalId?: string,
//     identities?: IExternalPersonIdentity[]
// }
// export interface IFeatureToggle extends Nudge.IRoutable {
//     name?: string,
//     fallbackValue: boolean,
//     explicitValue?: boolean,
//     createdAt?: Date
// }
// export interface IFeedBadge extends Nudge.IRoutable {
//     badges?: FeedBadgeType[]
// }
// export enum FeedBadgeType {
//     todo = 1,
//     rareActivity = 2,
//     losingTouch = 3
// }
export enum FlaggedDataTypeEnum {
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
// export interface IGeoValue {
//     region?: string,
//     country?: string,
//     state?: string,
//     city?: string,
//     address?: string,
//     postalCode?: string,
//     lat: number,
//     long: number,
//     confidence: number
// }
// export interface IGoogleSearchConfirmation {
//     queryCount: number,
//     jobId: number,
//     jobName?: string
// }
// export interface IGoogleSearchJob {
//     id: number,
//     createDate?: Date,
//     completeDate?: Date,
//     complete: boolean,
//     jobName?: string,
//     queryType?: string,
//     queryCategory?: string,
//     aggregates: number,
//     pendingQueries: number,
//     completedQueries: number,
//     failedQueries: number
// }
// export enum GoogleSearchQueryCategory {
//     Untargeted = 0,
//     Targeted = 1,
//     LinkedInMatch = 2
// }
// export enum GoogleSearchQueryType {
//     BucketExecs = 3,
//     BucketRoles = 4,
//     UserRelationships = 5,
//     TeamRelationships = 6,
//     UserRelationshipsForBucket = 7,
//     CompanyAggregateExecs = 9,
//     CompanyAggregateRoles = 10,
//     TeamRelationshipsForBucket = 12,
//     CustomAggregateIds = 13
// }
// export interface IGoogleSearchRequest {
//     jobId: number,
//     primaryEntityId: number,
//     secondaryEntityId: number,
//     relationshipThreshold: number,
//     discoverLinkedInHandles: boolean,
//     titles?: string[],
//     ids?: number[],
//     queryType: GoogleSearchQueryType,
//     queryCategory: GoogleSearchQueryCategory
// }
// export interface IHighlight extends Nudge.IRoutable {
//     peopleLists?: IPersonList[],
//     companiesLists?: ICompanyList[]
// }
// export interface IHighlightInteraction {
//     type: HighlightInteractionType,
//     date?: string
// }
// export enum HighlightInteractionType {
//     view = 1,
//     ignoreContent = 3,
//     craftMessage = 1000,
//     like = 1002,
//     retweet = 1003,
//     tweetReply = 1004,
//     shareOnTwitter = 1005,
//     shareOnLinkedIn = 1006,
//     shareOnFacebook = 1007
// }
// export interface IHighlightReason {
//     type: BadgeReasonEnum,
//     identifier?: string,
//     date?: Date
// }
// export interface IHighlightScore extends Nudge.IRoutable {
//     current: boolean,
//     updateDate: Date
// }
// export enum HighlightScoreType {
//     personBase = 1,
//     companyBase = 2,
//     newsItem = 3,
//     socialsItem = 4,
//     recentMeeting = 6,
//     recentEmail = 7,
//     pinnedList = 8,
//     todoSet = 9,
//     losingTouch = 10,
//     rareActivity = 11,
//     profileView = 12,
//     matchedEvents = 13,
//     matchedInterests = 14,
//     userOwned = 15,
//     unlistedList = 16
// }
// export enum HighlightSourceTypeEnum {
//     news = 1,
//     socials = 2,
//     marketing = 3
// }
// export enum IdentityTypeEnum {
//     internaluser = 0,
//     email = 1,
//     twitter = 2,
//     linkedin = 3,
//     facebookperson = 4,
//     googleplus = 5,
//     instagram = 6,
//     pinterest = 7,
//     phonenumber = 8,
//     crunchbaseperson = 9,
//     externaldatasource = 10,
//     encryptedemail = 11,
//     standarddata = 12,
//     facebookpage = 1001,
//     dunsnumber = 1002,
//     domainname = 1003,
//     crunchbasebusiness = 1004,
//     companyname = 1005,
//     companyticker = 1006,
//     companytwitter = 1007,
//     companylinkedin = 1008,
//     unknown = -1
// }
// export interface IIgnoredAggregateInteractionPrompt extends Nudge.IRoutable {
//     aggregateId: number,
//     userId: number,
//     user?: IUser,
//     ignoredDate: Date,
//     interactionPromptType: number
// }
// export interface ILocalDateTime {
//     localDateTime?: string
// }
// export interface IImport extends Nudge.IRoutable {
//     name?: string,
//     latest?: IImportHistory
// }
// export interface IImportHistory extends Nudge.IRoutable {
//     startedAt?: Date,
//     finishedAt?: Date,
//     dataTimestamp?: Date
// }
// export enum ImportStatus {
//     pending = 0,
//     active = 1,
//     complete = 2
// }
// export interface IIndustry extends Nudge.IRoutable {
//     name?: string,
//     parent?: IIndustry,
//     parentUri?: string
// }
// export interface IInteraction extends Nudge.IRoutable {
//     type: InteractionTypeEnum,
//     identifier?: string,
//     localDateTime?: string,
//     date: Date
// }
// export enum InteractionTypeEnum {
//     seen = 1,
//     view = 2,
//     dismiss = 3,
//     like = 4,
//     dislike = 5,
//     hide = 6,
//     unhide = 7,
//     craftEmail = 1000,
//     directMessageOnTwitter = 1001,
//     likeOnTwitter = 1002,
//     retweet = 1003,
//     tweetReply = 1004,
//     shareOnTwitter = 1005,
//     shareOnLinkedIn = 1006,
//     shareOnFacebook = 1007
// }
// export interface IInvitePublic {
//     invitingUserFirstName?: string,
//     invitingUserImageUrl?: string,
//     teamName?: string
// }
// export interface IInvoicedLicenseSlot extends Nudge.IRoutable {
//     startDate: Date,
//     expiryDate: Date,
//     companyAccountLicense?: ICompanyAccountLicense
// }
export interface IJobRole extends Nudge.IRoutable {
    name?: string;
    parent?: IJobRole;
    parentUri?: string;
}
// export interface IJobSkill extends Nudge.IRoutable {
//     name?: string
// }
// export enum ListAccessibilityType {
//     private = 0,
//     shared = 1,
//     public = 3
// }
// export enum ListCadenceStatusType {
//     none = 0,
//     processing = 1,
//     complete = 2
// }
// export enum ListCadenceType {
//     none = 0,
//     oneWeek = 1,
//     twoWeeks = 2,
//     threeWeeks = 3,
//     oneMonth = 4,
//     threeMonths = 5,
//     sixMonths = 6,
//     twelveMonths = 7
// }
// export enum ListCapabilityType {
//     read = 0,
//     write = 1,
//     admin = 2,
//     export = 10,
//     reporting = 20
// }
// export enum ListSocialTrendType {
//     Url = 0,
//     Hashtag = 1,
//     Mention = 2
// }
// export enum ListSocialType {
//     Tweet = 0
// }
// export enum ListSourceType {
//     user = 0,
//     active = 1,
//     complement = 2,
//     companyfamily = 3,
//     activeCompanies = 4,
//     upcomingMeetings = 5,
//     newRelationships = 6,
//     losingTouch = 7,
//     recentInteractions = 8,
//     todos = 9,
//     externalSystemCompanies = 10,
//     externalSystemContacts = 11,
//     cadencePreselectedShort = 12,
//     cadencePreselectedMedium = 13,
//     cadencePreselectedLong = 14,
//     companyUpcomingMeetings = 15,
//     companyNewRelationships = 16,
//     companyLosingTouch = 17,
//     companyRecentInteractions = 18,
//     companyCadencePreselectedShort = 19,
//     companyCadencePreselectedMedium = 20,
//     companyCadencePreselectedLong = 21,
//     searchSnapshot = 22,
//     companySearchSnapshot = 23
// }
// export enum ListSubscriptionType {
//     available = 0,
//     subscribed = 1,
//     deleted = 2
// }
// export enum ListType {
//     person = 0,
//     company = 1
// }
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
export enum NetworkHealthStatus {
    unknown = 0,
    known = 1,
    processing = 2
}
// export interface INewsInterest extends Nudge.IRoutable {
//     interests?: ContentItemEventEnum[]
// }
// export interface INudgeTopic extends Nudge.IRoutable {
//     name?: string,
//     imageUrl?: string,
//     description?: string,
//     category: number,
//     contentItem?: INudgeTopicContentItem
// }
// export interface INudgeTopicContentItem extends Nudge.IRoutable {
//     contentItemId?: number,
//     nudgeTopicId?: number,
//     contentUrl?: string,
//     publishDate?: Date,
//     newsEvents?: ContentItemEventEnum[],
//     interactions?: IInteraction[],
//     peopleMentions?: IPersonMention[],
//     companiesMentions?: ICompanyMention[]
// }
// export interface IParsedQuery {
//     rawQuery?: string,
//     parsedIntent: number
// }
export enum PaymentType {
    free = 1,
    invoiced = 2,
    creditCard = 3
}
// export interface IPeopleListChange extends Nudge.IRoutable {
//     identityType?: string,
//     identityValue?: string,
//     name?: string,
//     title?: string,
//     company?: string,
//     imageUrl?: string,
//     listId: number,
//     listUri?: string,
//     addToList: boolean
// }
// export interface IPeopleListExport extends Nudge.IRoutable {
//     createDate: Date,
//     processed: number
// }
// export interface IPeopleListUpload extends Nudge.IRoutable {
//     createDate: Date,
//     name?: string,
//     processed: number,
//     unprocessed: number,
//     userDisplayName?: string
// }
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
// export interface IPerson extends Nudge.IRoutable {
//     name?: string,
//     imageUrl?: string,
//     company?: ICompany,
//     title?: string,
//     level?: string,
//     skills?: IJobSkill[],
//     roles?: IJobRole[],
//     interests?: ISubject[],
//     address?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     location?: string,
//     completeness?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strengthLost?: number,
//     introStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     introStrength2?: RelationshipStrength,
//     introConnections?: number,
//     status?: RelationshipStatus,
//     priority?: number,
//     identities?: IPersonIdentity[],
//     reminder?: IReminder,
//     user?: IUser
// }
// export interface IPersonCurrentConversation {
//     personId: number,
//     name?: string,
//     outreachCount: number,
//     responseCount: number,
//     bothCount: number,
//     interactionList?: IUser[]
// }
// export interface IPersonDuplicate extends Nudge.IRoutable {
//     DuplicatePerson?: IPerson,
//     DuplicatePersonIdentity?: string,
//     DuplicatePersonIdentityType?: string,
//     DuplicationStatus: number,
//     UserComment?: string
// }
// export interface IPersonExperience extends Nudge.IRoutable {
//     companyAggregateId: number,
//     companyDisplayName?: string,
//     jobTitle?: string,
//     imgThmUrl?: string,
//     isPrimary: boolean,
//     isCurrrent: boolean
// }
export interface IPersonIdentity {
    externalUrl?: string;
    identity?: string;
    type?: PersonIdentityTypeEnum;
}
export enum PersonIdentityTypeEnum {
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
// export interface IPersonImage {
//     imageUrl?: string,
//     score: number
// }
// export interface IPersonLastCommunication extends Nudge.IRoutable {
//     communicationMedium: CommunicationMedium,
//     action?: string,
//     lastActionDate?: Date
// }
// export interface IPersonList extends Nudge.IRoutable {
//     subscriptions?: IPersonListSubscription[],
//     cadences?: IPersonListCadence[],
//     capabilities?: IPersonListCapability[],
//     accesses?: IPersonListAccess[],
//     news?: IPersonListNews[],
//     socials?: IPersonListSocial[],
//     communications?: IPersonListCommunication[],
//     name?: string,
//     type: ListType,
//     owner?: IUser,
//     accessibility: ListAccessibilityType,
//     subscriberCount?: number,
//     memberCount?: number,
//     source: ListSourceType,
//     networkHealth?: INetworkHealthScore,
//     status?: string,
//     highlights?: string[]
// }
// export interface IPersonListAccess extends Nudge.IRoutable {
//     user?: IUser,
//     team?: ITeam,
//     teamLeadership?: boolean,
//     collaborators?: boolean
// }
// export interface IPersonListCadence extends Nudge.IRoutable {
//     type: ListCadenceType,
//     status?: ListCadenceStatusType,
//     outstanding?: number,
//     completed?: number,
//     ignored?: number
// }
// export interface IPersonListCapability extends Nudge.IRoutable {
//     user?: IUser,
//     capability: ListCapabilityType
// }
// export interface IPersonListCommunication extends Nudge.IRoutable {
//     person?: IPerson,
//     type?: CommunicationMedium,
//     range?: CommunicationDateRange,
//     date?: Date
// }
// export interface IPersonListHighlight extends Nudge.IRoutable {
//     newsItem?: IPersonListNews,
//     socialItem?: IPersonListSocial,
//     source: HighlightSourceTypeEnum,
//     score: number,
//     date: Date,
//     reasons?: IHighlightReason[],
//     interactions?: IHighlightInteraction[]
// }
// export interface IPersonListMember extends Nudge.IRoutable {
//     person?: IPerson,
//     company?: ICompany,
//     hidden?: boolean
// }
// export interface IPersonListMemberRecommendation extends Nudge.IRoutable {
//     person?: IPerson,
//     user?: IUser,
//     status: RecommendationStatusType
// }
// export interface IPersonListNetworkCollaborator extends Nudge.IRoutable {
//     user?: IUserWithEmail,
//     people?: IPerson[],
//     peopleCount?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     companies?: ICompany[],
//     companyCount?: number,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface IPersonListNetworkHealth extends Nudge.IRoutable {
//     user?: IUser,
//     team?: ITeam,
//     all: boolean,
//     networkHealth?: INetworkHealthScore
// }
// export interface IPersonListNetworkInactiveCollaborator extends Nudge.IRoutable {
//     user?: IUserWithEmail,
//     people?: IPerson[],
//     peopleCount?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     companies?: ICompany[],
//     companyCount?: number,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface IPersonListNetworkMember extends Nudge.IRoutable {
//     users?: IUserWithEmail[],
//     userCount?: number,
//     person?: IPerson,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     company?: ICompany,
//     networkHealthScore?: INetworkHealthScore
// }
// export interface IPersonListNews extends Nudge.IRoutable {
//     personMember?: IPersonListMember,
//     company?: ICompany,
//     people?: IPerson[],
//     nudgeTopic?: INudgeTopic,
//     seen: boolean,
//     badges?: BadgeReasonEnum[],
//     subjects?: ISubject[]
// }
// export interface IPersonListOutreach extends Nudge.IRoutable {
//     cadence1Week: number,
//     cadence2Weeks: number,
//     cadence3Weeks: number,
//     cadence1Month: number,
//     cadence3Months: number,
//     cadence6Months: number,
//     cadence12Months: number,
//     cadenceOlder: number
// }
// export interface IPersonListRecommendation extends Nudge.IRoutable {
//     list?: IPersonList,
//     status: RecommendationStatusEnum
// }
// export interface IPersonListSearchSnapshot extends Nudge.IRoutable {
//     list?: IPersonList,
//     name?: string,
//     query?: string,
//     frequency: number,
//     limit: number
// }
// export interface IPersonListSocial extends Nudge.IRoutable {
//     personMember?: IPersonListMember,
//     tweet?: ITweet,
//     seen: boolean,
//     badges?: BadgeReasonEnum[]
// }
// export interface IPersonListSocialTrend extends Nudge.IRoutable {
//     numberOfUses: number,
//     entityType: ListSocialTrendType,
//     entityValue?: string,
//     eventDetails?: ITrendingEvent[],
//     contentDetails?: ITweetContent
// }
// export interface IPersonListStreak extends Nudge.IRoutable {
//     currentStreak: number,
//     maxStreak: number,
//     currentWeeklyStreak: number,
//     maxWeeklyStreak: number
// }
// export interface IPersonListSubscription extends Nudge.IRoutable {
//     list?: IPersonList,
//     user?: IUser,
//     subscription: ListSubscriptionType,
//     cadence: ListCadenceType,
//     isOnHomepage: boolean,
//     pinned: boolean
// }
// export interface IPersonLocation {
//     locationName?: string,
//     addressValue?: IGeoValue,
//     score: number
// }
// export interface IPersonMention extends Nudge.IRoutable {
//     personId?: string,
//     companyId?: string,
//     person?: IPerson,
//     company?: ICompany,
//     nudgeTopic?: INudgeTopic,
//     highlight?: string,
//     available: boolean
// }
// export interface IPersonName {
//     firstName?: string,
//     middleName?: string,
//     lastName?: string,
//     singleName?: string,
//     scrore: number
// }
// export interface IPersonNote extends Nudge.IRoutable {
//     createDate: Date,
//     rawNote?: string,
//     noteType: number,
//     repeatDayCount: number,
//     isDismissed: boolean
// }
// export interface IPersonOption extends Nudge.IRoutable {
//     nameOptions?: IPersonName[],
//     imageOptions?: IPersonImage[],
//     locationOptions?: IPersonLocation[]
// }
// export interface IPersonSnippet extends Nudge.IRoutable {
//     user?: IUserWithEmail,
//     person?: IPerson,
//     contentItem?: IContentItem,
//     tweet?: ITweet,
//     businessNote?: IBusinessNote,
//     score: number
// }
// export interface IPersonTeamActivity extends Nudge.IRoutable {

// }
// export interface IPersonTeamNhs {
//     personId: number,
//     name?: string,
//     networkHealth?: INetworkHealthScore
// }
// export interface IPersonWithLastInteraction extends Nudge.IRoutable {
//     lastInteraction: Date,
//     name?: string,
//     imageUrl?: string,
//     company?: ICompany,
//     title?: string,
//     level?: string,
//     skills?: IJobSkill[],
//     roles?: IJobRole[],
//     interests?: ISubject[],
//     address?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     location?: string,
//     completeness?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strengthLost?: number,
//     introStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     introStrength2?: RelationshipStrength,
//     introConnections?: number,
//     status?: RelationshipStatus,
//     priority?: number,
//     identities?: IPersonIdentity[],
//     reminder?: IReminder,
//     user?: IUser
// }
// export interface IPersonWithSlug extends Nudge.IRoutable {
//     slug?: string,
//     name?: string,
//     imageUrl?: string,
//     company?: ICompany,
//     title?: string,
//     level?: string,
//     skills?: IJobSkill[],
//     roles?: IJobRole[],
//     interests?: ISubject[],
//     address?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     location?: string,
//     completeness?: number,
//     strength?: RelationshipStrength,
//     maxStrength?: RelationshipStrength,
//     strengthLost?: number,
//     introStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     introStrength2?: RelationshipStrength,
//     introConnections?: number,
//     status?: RelationshipStatus,
//     priority?: number,
//     identities?: IPersonIdentity[],
//     reminder?: IReminder,
//     user?: IUser
// }
// export enum PublicBucketRankType {
//     Other = 0,
//     SocialRank = 1
// }
// export enum PublicBucketType {
//     Person = 0,
//     Company = 1
// }
// export interface IPublicCompany {
//     PublicCompanyId: number,
//     CompanyDisplayName?: string,
//     PrimaryCompanyDomain?: string,
//     Slug?: string,
//     CompletenessScore: number,
//     UpdateDate?: Date,
//     LastScoreDate?: Date
// }
// export enum PublicCompanyActivitySource {
//     Company = 0,
//     Person = 1,
//     CompanyList = 2,
//     PersonList = 3,
//     NotFound = 4,
//     Homepage = 5
// }
// export enum PublicCompanyActivityType {
//     SessionStart = 0,
//     ClickedExecutives = 1,
//     ClickedConnectors = 2,
//     ClickedSociallyProximalCompanies = 3,
//     ClickedCompaniesAlsoInTheNews = 4,
//     ClickedRecentNews = 5,
//     ClickedPersonMention = 6,
//     ClickedGetNudgePremium = 7,
//     ClickedLearnMore = 8,
//     ClickedSocialLinkWebsite = 9,
//     ClickedSocialLinkTwitter = 10,
//     ClickedSocialLinkFacebook = 11,
//     ClickedSocialLinkLinkedin = 12,
//     ClickedReadMore = 13,
//     SessionEnd = 14,
//     ClickedSlidingPaywallNoText = 15,
//     ClickedSlidingPaywallYesText = 16,
//     ClickedSearch = 17,
//     ClickedSearchResult = 18,
//     ListSessionStart = 19,
//     ListSessionEnd = 20,
//     ClickedListNews = 21,
//     ClickedListCompany = 22,
//     ClickedSuggestCompany = 23,
//     SuggestedCompany = 24,
//     ClickedSuggestEdit = 25,
//     SuggestedEdit = 26,
//     NotFoundSessionStart = 27,
//     NotFoundSessionEnd = 28,
//     ClickedSidebarLearnMore = 29,
//     ClickedFollowCompany = 30,
//     ClickedSeeYourRelationships = 31,
//     ClickedCompany = 32,
//     ClickedCompanyList = 33,
//     ClickedCompanyNews = 34,
//     ClickedGetInTouch = 35,
//     ClickedMoreCompanyNews = 36,
//     ClickedMorePersonNews = 37,
//     ClickedMoreTweets = 38,
//     ClickedPersonNews = 39,
//     ClickedTweet = 40,
//     ClickedMoreEmployeesNews = 41,
//     ClickedMoreExecutives = 42,
//     ClickedMoreConnectors = 43,
//     ClickedWorkExperience = 44
// }
// export interface IPublicCompanyAdmin {
//     PublicCompanyID?: number,
//     AggregateID?: number,
//     ImageUrl?: string,
//     CachedImageUrl?: string,
//     Domain?: string,
//     DisplayName?: string,
//     Description?: string,
//     Slug?: string,
//     UpdateDate?: Date,
//     LastScoreDate?: Date,
//     ReviewDate?: Date,
//     Reviewer?: string,
//     IsPublicCompany?: boolean,
//     Whitelisted?: boolean,
//     ReviewStatus?: number,
//     ConnectednessRank?: number,
//     Score: number,
//     ScoreAggregateRelationships: number,
//     ScoreCompanyMentionCooccurance: number,
//     ScoreCompanyMentions: number,
//     ScoreCompanySocialProximity: number,
//     ScoreConnectors: number,
//     ScoreDistinctPeople: number,
//     ScoreExecutives: number,
//     ScoreFrequentlyMentionedPeople: number,
//     ScoreFrequentlyMentionedSubjects: number
// }
// export interface IPublicCompanyAggregateBlacklist {
//     PublicCompanyAggregateBlacklistId: number,
//     PublicCompanyId: number,
//     AggregateId: number
// }
// export interface IPublicCompanyEdit {
//     id: number,
//     anonymousId?: string,
//     emailAddress?: string,
//     createDate: Date,
//     comment?: string,
//     slug?: string,
//     currentValue?: string,
//     newValue?: string,
//     editField: EditField,
//     companyAggregateId: number,
//     companyName?: string
// }
// export interface IPublicCompanyList {
//     PublicCompanyBucketID: number,
//     BucketID: number,
//     PublicBucketType: PublicBucketType,
//     BucketName?: string,
//     BucketDescription?: string,
//     Slug?: string,
//     BucketUpdateDate: Date,
//     BucketMemberCount: number,
//     BucketFollowerCount: number,
//     Companies?: IPublicCompanyListMember[],
//     Mentions?: IPublicCompanyMention[],
//     People?: IPublicPeopleListMember[],
//     MaxEmployeeCount: number,
//     MinEmployeeCount: number,
//     PublicBucketRankType: PublicBucketRankType,
//     FrequentNewsSources?: string[],
//     FrequentTopics?: string[],
//     IsWhitelisted: boolean
// }
// export interface IPublicCompanyListMember {
//     CompanyAggregateId: number,
//     Rank: number,
//     CompanyName?: string,
//     Slug?: string,
//     ImageUrl?: string,
//     Description?: string
// }
// export interface IPublicCompanyMention {
//     publicCompanySlug?: string,
//     companyAggregateImageUrl?: string,
//     companyDisplayName?: string,
//     companyAggregateID: number,
//     contentImageUrl?: string,
//     contentDescription?: string,
//     contentUrl?: string,
//     contentTitle?: string,
//     publishDate: Date
// }
// export interface IPublicCompanyRedisKeyValue {
//     Key?: string,
//     Value?: string
// }
// export interface IPublicCompanySearchResult {
//     PublicCompanyId: number,
//     CompanyAggregateMetaDataId: number,
//     Slug?: string,
//     CompanyName?: string,
//     Domain?: string,
//     ImageUrl?: string
// }
// export interface IPublicCompanySuggestedCompany {
//     suggestedCompanyId: number,
//     publicCompanyListId: number,
//     companyName?: string,
//     companyWebsite?: string,
//     createDate: Date,
//     resolvedDate?: Date,
//     resolvingUser?: string
// }
// export interface IPublicCompanySuggestedEdit {
//     suggestedEditId: number,
//     publicCompanyId: number,
//     suggestedEditType: SuggestedEditType,
//     emailAddress?: string,
//     otherText?: string,
//     createDate: Date,
//     resolvedDate?: Date,
//     resolvingUser?: string
// }
// export interface IPublicCompanySuggestedPerson {
//     suggestedPersonId: number,
//     publicCompanyId: number,
//     aggregateSuggestedEditType: AggregateSuggestedEditType,
//     publicPersonID?: number,
//     aggregateID?: number,
//     otherText?: string,
//     emailAddress?: string,
//     createDate: Date,
//     resolvedDate?: Date,
//     resolvingUser?: string
// }
// export interface IPublicCompanyWithMetaData {
//     PublicCompanyId: number,
//     CompanyAggregateMetaDataId: number,
//     Slug?: string,
//     Company?: ICompany,
//     IsWhitelisted: boolean,
//     IsBlacklisted: boolean,
//     ReviewStatus?: ReviewStatus,
//     EmployeeCount: number,
//     State?: string,
//     Country?: string
// }
// export interface IPublicList {
//     PublicCompanyBucketID: number,
//     BucketID: number,
//     PublicBucketType: PublicBucketType,
//     Name?: string,
//     Description?: string,
//     Slug?: string,
//     PublicBucketRankType: PublicBucketRankType,
//     IsWhitelisted: boolean
// }
// export interface IPublicPeopleList {
//     PublicCompanyBucketID: number,
//     BucketID: number,
//     PublicBucketType: PublicBucketType,
//     BucketName?: string,
//     BucketDescription?: string,
//     Slug?: string,
//     People?: IPublicPeopleListMember[],
//     CompanyMentions?: IPublicCompanyMention[],
//     PublicBucketRankType: PublicBucketRankType,
//     IsWhitelisted: boolean
// }
// export interface IPublicPeopleListAdminMember {
//     RawImageUrl?: string,
//     ID: number,
//     AggregateId: number,
//     Rank: number,
//     IsWhitelisted: boolean,
//     ReviewStatus: ReviewStatus,
//     Name?: string,
//     Title?: string,
//     Slug?: string,
//     ImageUrl?: string,
//     CompanyAggregateId: number,
//     CompanyName?: string,
//     CompanySlug?: string,
//     CompanyImageUrl?: string
// }
// export interface IPublicPeopleListMember {
//     ID: number,
//     AggregateId: number,
//     Rank: number,
//     IsWhitelisted: boolean,
//     ReviewStatus: ReviewStatus,
//     Name?: string,
//     Title?: string,
//     Slug?: string,
//     ImageUrl?: string,
//     CompanyAggregateId: number,
//     CompanyName?: string,
//     CompanySlug?: string,
//     CompanyImageUrl?: string
// }
// export interface IPublicPerson {
//     PublicPersonId: number,
//     Slug?: string,
//     Rank: number,
//     ReviewStatus?: ReviewStatus,
//     IsWhitelisted: boolean,
//     Person?: IPerson,
//     PublicCompany?: IPublicCompany
// }
// export interface IPublicPersonEdit {
//     id: number,
//     emailAddress?: string,
//     anonymousId?: string,
//     createDate: Date,
//     comment?: string,
//     slug?: string,
//     currentValue?: string,
//     newValue?: string,
//     editField: EditField,
//     aggregateId: number,
//     publicCompanyId?: number,
//     publicCompanyName?: string,
//     personName?: string,
//     blacklistedId?: number
// }
// export interface IQuestion extends Nudge.IRoutable {
//     questionType?: IQuestionType,
//     person?: IPerson,
//     answerStatus: AnswerStatusEnum,
//     answerDate?: Date,
//     answerSuggestions?: IAnswerSuggestion[],
//     selectedAnswer: number,
//     questionCreateDate: Date
// }
// export interface IQuestionFormat {
//     formatSeedId?: string,
//     formatName?: string
// }
// export interface IQuestionType {
//     questionFormat?: IQuestionFormat,
//     questionSeedId?: string,
//     questionText?: string,
//     nullOptionText?: string,
//     noneOptionText?: string
// }
// export interface IRawMarketingEvent extends Nudge.IRoutable {
//     eventDataType?: string,
//     companyName?: string,
//     email?: string,
//     twitter?: string,
//     eventDate: Date,
//     sourceSystem?: string,
//     eventTypeCode?: string,
//     eventDetailDescription?: string,
//     eventDetailImageOverride?: string,
//     eventDetailURLOverride?: string
// }
// export enum RecommendationStatusEnum {
//     recommended = 0,
//     taken = 1,
//     dismissed = 2
// }
// export enum RecommendationStatusType {
//     proposed = 0,
//     accepted = 1,
//     ignored = 2
// }
// export interface IRelationshipImport extends Nudge.IRoutable {
//     name?: string,
//     latest?: IImportHistory
// }
// export enum RelationshipStatus {
//     active = 0,
//     hyperActive = 1,
//     reminder = 2,
//     vip = 3,
//     hibernate = 4,
//     hide = 5,
//     dismiss = 6,
//     followUp = 7
// }
// export enum RelationshipStrength {
//     none = 0,
//     veryWeak = 1,
//     weak = 2,
//     medium = 3,
//     strong = 4,
//     veryStrong = 5
// }
// export interface IReminder extends Nudge.IRoutable {
//     dueDate?: Date,
//     reminderDate?: Date,
//     note?: string,
//     replyNote?: string,
//     status?: UserToDoStatusEnum,
//     category?: UserToDoCurrentStatusEnum,
//     timeframe?: UserToDoTimeframeStatusEnum
// }
// export enum ReviewStatus {
//     Approve = 1,
//     Reject = 2
// }
// export interface ISmsMessage extends Nudge.IRoutable {
//     to?: string,
//     body?: string,
//     createdAt?: Date
// }
// export interface IStandardIndustry extends Nudge.IRoutable {
//     industryId?: string,
//     naicsDepth: number,
//     naicsParent?: string,
//     industryStandardName?: string,
//     naicsFullName?: string
// }
// export interface IStandardJobCategory {
//     jobCategory?: string,
//     jobCategoryName?: string
// }
// export interface IStandardJobRole extends Nudge.IRoutable {
//     jobRole?: string,
//     jobRoleName?: string,
//     standardJobCategory?: IStandardJobCategory
// }
export interface IStandardTimeZone {
    stnNam?: string;
    stnNamOff?: string;
    posOff: boolean;
    hrsOff: number;
    minOff: number;
    stnTmeZneId: number;
}
// export interface IStripeCardResponse {
//     isValid: boolean,
//     responseCode?: string,
//     responseMessage?: string,
//     customerId?: string,
//     cardId?: string
// }
// export interface ISubject extends Nudge.IRoutable {
//     name?: string,
//     raw?: string[]
// }
// export enum SuggestedEditType {
//     other = 0,
//     companyName = 1,
//     companyLogo = 2,
//     companyDescription = 4,
//     companyLinks = 8,
//     newsMentions = 16,
//     people = 32
// }
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
export enum TeamCapabilityType {
    contributor = 1,
    manager = 2,
    reporting = 4
}
// export interface ITeamCurrentConversation {
//     user?: IUser,
//     interactionList?: IPersonWithLastInteraction[]
// }
// export interface ITeamCurrentConversationByAgg {
//     person?: IPerson,
//     interactionList?: IUserWithLastInteraction[]
// }
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
export enum TeamInviteStatus {
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
export enum TeamMemberActiveStatus {
    active = 1,
    awaitingLicense = 2,
    awaitingInvite = 3
}
// export interface ITeamMemberCurrentConversation {
//     user?: IUser,
//     interactionList?: IAggregateConversationSummary[]
// }
// export interface ITeamMemberCurrentConversationNew {
//     user?: IUser,
//     aggregateList?: IAggregateConversationSummaryNew[]
// }
// export interface ITeamRelationshipsBreadthAndDepth {
//     companyAggregateID: number,
//     mainCompanyName?: string,
//     uniqueStrongRelationshipsWithUsersOnTeam: number
// }
export enum TeamType {
    publicTeam = "publicTeam",
    privateTeam = "privateTeam",
    companyTeam = "companyTeam",
    systemTeam = "systemTeam",
    personalTeam = "personalTeam"
}
// export interface ITextPart {
//     type: number,
//     displayValue?: string,
//     value?: string
// }
// export interface ITrendingEvent {
//     aggregateId?: string,
//     identityType: number,
//     identityValue?: string,
//     eventType: ListSocialType,
//     eventId?: string,
//     eventDate: Date
// }
// export interface ITweet extends Nudge.IRoutable {
//     screenName?: string,
//     tweetId?: string,
//     twitterUri?: string,
//     tweetDate: Date,
//     text?: string,
//     retweetCount: number,
//     favoriteCount: number,
//     textParts?: ITextPart[],
//     hashtags?: string[],
//     urls?: string[],
//     photos?: string[],
//     videos?: string[],
//     likes?: ITwitterLike[],
//     retweets?: ITwitterRetweet[],
//     content?: ITweetContent,
//     interactions?: IInteraction[]
// }
// export interface ITweetContent {
//     url?: string,
//     title?: string,
//     description?: string,
//     siteName?: string,
//     publishDate: Date,
//     keywords?: string[],
//     images?: string[],
//     contentType?: string
// }
// export interface ITwitterFriendship extends Nudge.IRoutable {
//     userScreenName?: string,
//     targetScreenName?: string,
//     following: boolean,
//     followingRequested: boolean,
//     followedBy: boolean
// }
// export interface ITwitterLike extends Nudge.IRoutable {
//     authorScreenName?: string,
//     tweetId?: string,
//     likedByScreenName?: string,
//     localDateTime?: string
// }
// export interface ITwitterMentionCounter extends Nudge.IRoutable {
//     solicited: number,
//     unsolicited: number
// }
// export interface ITwitterRetweet extends Nudge.IRoutable {
//     originalId?: string,
//     retweetScreenName?: string,
//     originalScreenName?: string,
//     originalDate: Date,
//     retweetId?: string,
//     retweetDate: Date
// }
// export interface IUberBannerData {
//     bannerdata?: string
// }
// export interface IUberdata extends Nudge.IRoutable {
//     peopleLists?: [],
//     companiesLists?: [],
//     banner?: IUberBannerData
// }
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
// export interface IUser extends Nudge.IRoutable {
//     collaborationType?: CollaborationTypeEnum,
//     collaborationDate?: Date,
//     userName?: string,
//     imageUrl?: string,
//     name?: string,
//     firstName?: string,
//     lastName?: string,
//     timeZone?: string,
//     timeZoneStandardName?: string,
//     timeZoneID?: number,
//     jobTitle?: string,
//     companyName?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     networkHealthScore?: INetworkHealthScore,
//     relationshipStrength?: RelationshipStrength,
//     maxRelationshipStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     isTestUser?: boolean,
//     personUri?: string
// }
// export interface IUserAccess {
//     accessType?: string
// }
// export enum UserAccessType {
//     Desktop = 0,
//     Mobile = 1,
//     SlackBot = 2,
//     ChromeExtension = 3,
//     OutlookAddIn = 4,
//     Widgets = 5
// }
// export interface IUserBadgeSummary extends Nudge.IRoutable {
//     referenceUri?: string,
//     count: number
// }
// export interface IUserCompanyUpload extends Nudge.IRoutable {
//     buckets?: ICompanyList[],
//     createDate: Date,
//     name?: string,
//     processed: number,
//     unprocessed: number
// }
// export interface IUserConnection extends Nudge.IRoutable {
//     userConnectionId: number,
//     userIdA: number,
//     userA?: IUser,
//     userIdB: number,
//     userB?: IUser,
//     connectionStatus: number,
//     status: UserConnectionStatusEnum,
//     inviteDate: Date,
//     connectionDate: Date
// }
// export interface IUserConnectionInvite extends Nudge.IRoutable {
//     userConnectionInviteId: number,
//     userConnectionId?: number,
//     userConnection?: IUserConnection,
//     userIdA: number,
//     userA?: IUser,
//     userIdB?: number,
//     userB?: IUser,
//     inviteRecipientEmail?: string,
//     inviteRecipientName?: string,
//     inviteDate: Date,
//     inviteText?: string,
//     inviteCount: number,
//     inviteStatus: number
// }
// export enum UserConnectionStatusEnum {
//     none = 0,
//     invited = 1,
//     connected = 2,
//     blocked = 6
// }
// export interface IUserContactUpload extends Nudge.IRoutable {
//     buckets?: IPersonList[],
//     createDate: Date,
//     name?: string,
//     processed: number,
//     unprocessed: number
// }
// export interface IUserFeatureToggle extends Nudge.IRoutable {
//     feature?: IFeatureToggle,
//     isWhitelisted?: boolean,
//     isBlacklisted?: boolean,
//     isEnabled?: boolean
// }
// export interface IUserFeedBadgeSetting extends Nudge.IRoutable {
//     badge?: string,
//     enabled?: boolean,
//     state: UserFeedSettingState
// }
// export interface IUserFeedEventSetting extends Nudge.IRoutable {
//     newsInterest?: string,
//     enabled?: boolean,
//     state: UserFeedSettingState
// }
// export enum UserFeedSettingState {
//     enabled = 1,
//     neutral = 2,
//     disabled = 3
// }
// export interface IUserFeedToggleSetting extends Nudge.IRoutable {
//     toggle?: string,
//     state: UserFeedSettingState
// }
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
export enum UserFlaggedDataStatusEnum {
    flagged = 1,
    rejected = 2,
    complete = 3
}
// export interface IUserFull extends Nudge.IRoutable {
//     licenses?: IUserLicense[],
//     hasAccessedChromeExtension: boolean,
//     isRelationshipStrengthCalculating: boolean,
//     isAnalyticsUser: boolean,
//     email?: string,
//     notificationEmail?: string,
//     impersonatedBy?: string,
//     roles?: string[],
//     userName?: string,
//     imageUrl?: string,
//     name?: string,
//     firstName?: string,
//     lastName?: string,
//     timeZone?: string,
//     timeZoneStandardName?: string,
//     timeZoneID?: number,
//     jobTitle?: string,
//     companyName?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     networkHealthScore?: INetworkHealthScore,
//     relationshipStrength?: RelationshipStrength,
//     maxRelationshipStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     isTestUser?: boolean,
//     personUri?: string
// }
// export interface IUserLicense {
//     companyAccountId: number,
//     companyAccountStatus: CompanyAccountStatus,
//     companyAccountName?: string,
//     companyAccountUri?: string,
//     companyAccountProductLevel: CompanyAccountProductLevel,
//     licenseStatus: CompanyAccountLicenseStatus,
//     licenseType?: string,
//     licenseExpiryDate?: Date
// }
// export interface IUserProTip {
//     proTipType?: string,
//     title?: string,
//     description?: string,
//     priority?: string,
//     callToActionUrl?: string,
//     callToActionText?: string,
//     pages?: string[]
// }
// export interface IUserSalutation extends Nudge.IRoutable {
//     greeting?: string,
//     goodbye?: string,
//     autoBcc: boolean,
//     autoBccAddress?: string,
//     createDate: Date
// }
// export interface IUserSignUpAggregate {
//     aggregateId: number,
//     aggregateType?: string,
//     name?: string,
//     title?: string,
//     company?: string,
//     location?: string,
//     imageUrl?: string,
//     email?: string,
//     twitter?: string,
//     linkedIn?: string,
//     website?: string,
//     contentType?: string,
//     contentText?: string,
//     contentSource?: string,
//     contentDate: Date,
//     completenessScore: number,
//     isColleague: boolean
// }
// export interface IUserSignUpStats {
//     aggregateRelationshipCount: number,
//     companyAggregateRelationshipCount: number,
//     mentionCount: number,
//     tweetCount: number,
//     emailCount: number,
//     meetingCount: number
// }
// export interface IUserStat extends Nudge.IRoutable {
//     totalContacts: number,
//     companyRelationships: number,
//     totalCollaborators: number,
//     totalLists: number
// }
// export interface IUserStreak extends Nudge.IRoutable {
//     activeStreak?: string[],
//     currentWeeksActions: number,
//     currentStreak: number,
//     maxStreak: number,
//     currentWeeklyStreak: number,
//     maxWeeklyStreak: number
// }
// export interface IUserTeamRecommendation extends Nudge.IRoutable {
//     probablyCoworkerCount: number,
//     companyName?: string,
//     companyLogo?: string
// }
// export interface IUserToDo extends Nudge.IRoutable {
//     person?: IPerson,
//     assigningUser?: IUser,
//     user?: IUser,
//     createDate?: Date,
//     dueDate?: Date,
//     reminderDate?: Date,
//     note?: string,
//     replyNote?: string,
//     status?: UserToDoStatusEnum,
//     category?: UserToDoCurrentStatusEnum,
//     timeframe?: UserToDoTimeframeStatusEnum
// }
// export enum UserToDoCurrentStatusEnum {
//     current = 1,
//     upcoming = 2
// }
// export enum UserToDoStatusEnum {
//     active = 1,
//     complete = 2,
//     ignored = 3,
//     declined = 4,
//     cancelled = 5
// }
// export enum UserToDoTimeframeStatusEnum {
//     notDue = 1,
//     dueSoon = 2,
//     overdue = 3
// }
// export interface IUserWithEmail extends Nudge.IRoutable {
//     email?: string,
//     collaborationType?: CollaborationTypeEnum,
//     collaborationDate?: Date,
//     userName?: string,
//     imageUrl?: string,
//     name?: string,
//     firstName?: string,
//     lastName?: string,
//     timeZone?: string,
//     timeZoneStandardName?: string,
//     timeZoneID?: number,
//     jobTitle?: string,
//     companyName?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     networkHealthScore?: INetworkHealthScore,
//     relationshipStrength?: RelationshipStrength,
//     maxRelationshipStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     isTestUser?: boolean,
//     personUri?: string
// }
// export interface IUserWithLastInteraction extends Nudge.IRoutable {
//     lastInteraction: Date,
//     collaborationType?: CollaborationTypeEnum,
//     collaborationDate?: Date,
//     userName?: string,
//     imageUrl?: string,
//     name?: string,
//     firstName?: string,
//     lastName?: string,
//     timeZone?: string,
//     timeZoneStandardName?: string,
//     timeZoneID?: number,
//     jobTitle?: string,
//     companyName?: string,
//     city?: string,
//     state?: string,
//     country?: string,
//     networkHealthScore?: INetworkHealthScore,
//     relationshipStrength?: RelationshipStrength,
//     maxRelationshipStrength?: RelationshipStrength,
//     strength2?: RelationshipStrength,
//     maxStrength2?: RelationshipStrength,
//     isTestUser?: boolean,
//     personUri?: string
// }
// export interface IUtm {
//     utm_campaign?: string,
//     utm_source?: string,
//     utm_medium?: string,
//     utm_term?: string,
//     utm_content?: string,
//     createDate: Date,
//     anonymousUserId?: string,
//     url?: string
// }
// export interface IWrappedErrorInfo {
//     HasEnoughData: boolean,
//     HasReceivedWelcomeEmail: boolean,
//     FirstName?: string
// }
// export interface IWrappedModel {
//     UserId: number,
//     FirstName?: string,
//     TopNetworkingMonth?: string,
//     TopTitle?: string,
//     Slug?: string,
//     SmallPreviewImageUrl?: string,
//     LargePreviewImageUrl?: string,
//     StrongerRelationships: number,
//     NewRelationships: number,
//     CompanyRelationships: number,
//     MeetingsAttended: number,
//     PeopleMet: number,
//     MinutesInMeetings: number,
//     HoursPerWeekInMeetings: number,
//     PeopleEmailed: number,
//     GlobalRank: number,
//     LocalName?: string,
//     LocalRank: number,
//     ActiveRelationships: number,
//     StrongRelationships: number,
//     TotalContacts: number,
//     CompaniesWithRelationships: number,
//     TopCities?: string[],
//     TopConnectors?: IPerson[],
//     TopStrongPeople?: IPerson[]
// }
