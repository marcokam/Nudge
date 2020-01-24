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
export var CardFundingType;
(function (CardFundingType) {
    CardFundingType[CardFundingType["credit"] = 1] = "credit";
    CardFundingType[CardFundingType["debit"] = 2] = "debit";
    CardFundingType[CardFundingType["prepaid"] = 3] = "prepaid";
})(CardFundingType || (CardFundingType = {}));
export var CompanyAccountLicenseRole;
(function (CompanyAccountLicenseRole) {
    CompanyAccountLicenseRole[CompanyAccountLicenseRole["user"] = 1] = "user";
    CompanyAccountLicenseRole[CompanyAccountLicenseRole["manager"] = 2] = "manager";
    CompanyAccountLicenseRole[CompanyAccountLicenseRole["administrator"] = 3] = "administrator";
})(CompanyAccountLicenseRole || (CompanyAccountLicenseRole = {}));
export var CompanyAccountLicenseStatus;
(function (CompanyAccountLicenseStatus) {
    CompanyAccountLicenseStatus[CompanyAccountLicenseStatus["active"] = 1] = "active";
    CompanyAccountLicenseStatus[CompanyAccountLicenseStatus["pausedManually"] = 2] = "pausedManually";
    CompanyAccountLicenseStatus[CompanyAccountLicenseStatus["pausedAutomatically"] = 3] = "pausedAutomatically";
    CompanyAccountLicenseStatus[CompanyAccountLicenseStatus["cancellationPending"] = 4] = "cancellationPending";
    CompanyAccountLicenseStatus[CompanyAccountLicenseStatus["notEnabled"] = 5] = "notEnabled";
})(CompanyAccountLicenseStatus || (CompanyAccountLicenseStatus = {}));
export var CompanyAccountProductLevel;
(function (CompanyAccountProductLevel) {
    CompanyAccountProductLevel[CompanyAccountProductLevel["team"] = 2] = "team";
    CompanyAccountProductLevel[CompanyAccountProductLevel["enterprise"] = 3] = "enterprise";
    CompanyAccountProductLevel[CompanyAccountProductLevel["professional"] = 4] = "professional";
})(CompanyAccountProductLevel || (CompanyAccountProductLevel = {}));
export var CompanyAccountStatus;
(function (CompanyAccountStatus) {
    CompanyAccountStatus[CompanyAccountStatus["active"] = 1] = "active";
    CompanyAccountStatus[CompanyAccountStatus["trialEnded"] = 2] = "trialEnded";
    CompanyAccountStatus[CompanyAccountStatus["pastDue"] = 3] = "pastDue";
    CompanyAccountStatus[CompanyAccountStatus["canceled"] = 4] = "canceled";
    CompanyAccountStatus[CompanyAccountStatus["deleted"] = 5] = "deleted";
    CompanyAccountStatus[CompanyAccountStatus["cancellationPending"] = 6] = "cancellationPending";
})(CompanyAccountStatus || (CompanyAccountStatus = {}));
export var CompanyIdentityTypeEnum;
(function (CompanyIdentityTypeEnum) {
    CompanyIdentityTypeEnum[CompanyIdentityTypeEnum["facebook"] = 1001] = "facebook";
    CompanyIdentityTypeEnum[CompanyIdentityTypeEnum["domain"] = 1003] = "domain";
    CompanyIdentityTypeEnum[CompanyIdentityTypeEnum["name"] = 1005] = "name";
    CompanyIdentityTypeEnum[CompanyIdentityTypeEnum["ticker"] = 1006] = "ticker";
    CompanyIdentityTypeEnum[CompanyIdentityTypeEnum["twitter"] = 1007] = "twitter";
    CompanyIdentityTypeEnum[CompanyIdentityTypeEnum["linkedin"] = 1008] = "linkedin";
})(CompanyIdentityTypeEnum || (CompanyIdentityTypeEnum = {}));
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
export var CreditCardType;
(function (CreditCardType) {
    CreditCardType[CreditCardType["visa"] = 1] = "visa";
    CreditCardType[CreditCardType["masterCard"] = 2] = "masterCard";
    CreditCardType[CreditCardType["americanExpress"] = 3] = "americanExpress";
    CreditCardType[CreditCardType["discover"] = 4] = "discover";
    CreditCardType[CreditCardType["dinersClub"] = 5] = "dinersClub";
    CreditCardType[CreditCardType["jcb"] = 6] = "jcb";
})(CreditCardType || (CreditCardType = {}));
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
export var FlaggedDataTypeEnum;
(function (FlaggedDataTypeEnum) {
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["personName"] = 1] = "personName";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["personDuplicate"] = 2] = "personDuplicate";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["personImage"] = 3] = "personImage";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["personBadMerge"] = 4] = "personBadMerge";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["personBadData"] = 5] = "personBadData";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["personMergeReview"] = 6] = "personMergeReview";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["personDataFromUser"] = 7] = "personDataFromUser";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["companyDuplicate"] = 102] = "companyDuplicate";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["companyBadMerge"] = 103] = "companyBadMerge";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["companyName"] = 104] = "companyName";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["companyBadData"] = 105] = "companyBadData";
    FlaggedDataTypeEnum[FlaggedDataTypeEnum["companyMergeReview"] = 106] = "companyMergeReview";
})(FlaggedDataTypeEnum || (FlaggedDataTypeEnum = {}));
export var NetworkHealthStatus;
(function (NetworkHealthStatus) {
    NetworkHealthStatus[NetworkHealthStatus["unknown"] = 0] = "unknown";
    NetworkHealthStatus[NetworkHealthStatus["known"] = 1] = "known";
    NetworkHealthStatus[NetworkHealthStatus["processing"] = 2] = "processing";
})(NetworkHealthStatus || (NetworkHealthStatus = {}));
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
export var PaymentType;
(function (PaymentType) {
    PaymentType[PaymentType["free"] = 1] = "free";
    PaymentType[PaymentType["invoiced"] = 2] = "invoiced";
    PaymentType[PaymentType["creditCard"] = 3] = "creditCard";
})(PaymentType || (PaymentType = {}));
export var PersonIdentityTypeEnum;
(function (PersonIdentityTypeEnum) {
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["internaluser"] = 0] = "internaluser";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["email"] = 1] = "email";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["twitter"] = 2] = "twitter";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["linkedin"] = 3] = "linkedin";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["facebook"] = 4] = "facebook";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["googleplus"] = 5] = "googleplus";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["instagram"] = 6] = "instagram";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["pinterest"] = 7] = "pinterest";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["phonenumber"] = 8] = "phonenumber";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["externaldatasource"] = 10] = "externaldatasource";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["encryptedemail"] = 11] = "encryptedemail";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["standarddata"] = 12] = "standarddata";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["crunchbase"] = 1004] = "crunchbase";
    PersonIdentityTypeEnum[PersonIdentityTypeEnum["unknown"] = -1] = "unknown";
})(PersonIdentityTypeEnum || (PersonIdentityTypeEnum = {}));
export var TeamCapabilityType;
(function (TeamCapabilityType) {
    TeamCapabilityType[TeamCapabilityType["contributor"] = 1] = "contributor";
    TeamCapabilityType[TeamCapabilityType["manager"] = 2] = "manager";
    TeamCapabilityType[TeamCapabilityType["reporting"] = 4] = "reporting";
})(TeamCapabilityType || (TeamCapabilityType = {}));
export var TeamInviteStatus;
(function (TeamInviteStatus) {
    TeamInviteStatus[TeamInviteStatus["invited"] = 1] = "invited";
    TeamInviteStatus[TeamInviteStatus["accepted"] = 2] = "accepted";
    TeamInviteStatus[TeamInviteStatus["ignored"] = 3] = "ignored";
    TeamInviteStatus[TeamInviteStatus["cancelled"] = 4] = "cancelled";
    TeamInviteStatus[TeamInviteStatus["awaitingMatch"] = 5] = "awaitingMatch";
    TeamInviteStatus[TeamInviteStatus["awaitingLicense"] = 6] = "awaitingLicense";
})(TeamInviteStatus || (TeamInviteStatus = {}));
export var TeamMemberActiveStatus;
(function (TeamMemberActiveStatus) {
    TeamMemberActiveStatus[TeamMemberActiveStatus["active"] = 1] = "active";
    TeamMemberActiveStatus[TeamMemberActiveStatus["awaitingLicense"] = 2] = "awaitingLicense";
    TeamMemberActiveStatus[TeamMemberActiveStatus["awaitingInvite"] = 3] = "awaitingInvite";
})(TeamMemberActiveStatus || (TeamMemberActiveStatus = {}));
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
export var TeamType;
(function (TeamType) {
    TeamType["publicTeam"] = "publicTeam";
    TeamType["privateTeam"] = "privateTeam";
    TeamType["companyTeam"] = "companyTeam";
    TeamType["systemTeam"] = "systemTeam";
    TeamType["personalTeam"] = "personalTeam";
})(TeamType || (TeamType = {}));
export var UserFlaggedDataStatusEnum;
(function (UserFlaggedDataStatusEnum) {
    UserFlaggedDataStatusEnum[UserFlaggedDataStatusEnum["flagged"] = 1] = "flagged";
    UserFlaggedDataStatusEnum[UserFlaggedDataStatusEnum["rejected"] = 2] = "rejected";
    UserFlaggedDataStatusEnum[UserFlaggedDataStatusEnum["complete"] = 3] = "complete";
})(UserFlaggedDataStatusEnum || (UserFlaggedDataStatusEnum = {}));
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
//# sourceMappingURL=NudgeInterfaces.js.map