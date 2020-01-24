export declare enum ApiErrorCodes {
    GenericValidationError = 100,
    FieldCustomValidation = 101,
    FieldRangeValidation = 102,
    FieldRegexValidation = 103,
    FieldRequired = 104,
    FieldStringLengthValidation = 105,
    FieldStringLengthIncludingMinValidation = 106,
    FieldMaxLengthValidation = 107,
    FieldMinLengthValidation = 108,
    AccessTokenMissing = 401000,
    AccessTokenInvalid = 401001,
    MissingScope = 401002,
    MissingBasicUserClaim = 403000,
    MissingRequiredField = 403001,
    InvalidFieldValue = 403002,
    MissingLikedByScreenName = 403005,
    NoIntegrationsAvailable = 403006,
    InvalidAuthorization = 403007
}
export interface ICountResponse {
    count?: number;
    value?: string;
}
export interface IErrorResponse {
    code: ApiErrorCodes;
    field?: string;
    message?: string;
}
export interface IRoutable {
    uri?: string;
}
