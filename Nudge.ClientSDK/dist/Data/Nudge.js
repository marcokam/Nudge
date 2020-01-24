export var ApiErrorCodes;
(function (ApiErrorCodes) {
    ApiErrorCodes[ApiErrorCodes["GenericValidationError"] = 100] = "GenericValidationError";
    ApiErrorCodes[ApiErrorCodes["FieldCustomValidation"] = 101] = "FieldCustomValidation";
    ApiErrorCodes[ApiErrorCodes["FieldRangeValidation"] = 102] = "FieldRangeValidation";
    ApiErrorCodes[ApiErrorCodes["FieldRegexValidation"] = 103] = "FieldRegexValidation";
    ApiErrorCodes[ApiErrorCodes["FieldRequired"] = 104] = "FieldRequired";
    ApiErrorCodes[ApiErrorCodes["FieldStringLengthValidation"] = 105] = "FieldStringLengthValidation";
    ApiErrorCodes[ApiErrorCodes["FieldStringLengthIncludingMinValidation"] = 106] = "FieldStringLengthIncludingMinValidation";
    ApiErrorCodes[ApiErrorCodes["FieldMaxLengthValidation"] = 107] = "FieldMaxLengthValidation";
    ApiErrorCodes[ApiErrorCodes["FieldMinLengthValidation"] = 108] = "FieldMinLengthValidation";
    ApiErrorCodes[ApiErrorCodes["AccessTokenMissing"] = 401000] = "AccessTokenMissing";
    ApiErrorCodes[ApiErrorCodes["AccessTokenInvalid"] = 401001] = "AccessTokenInvalid";
    ApiErrorCodes[ApiErrorCodes["MissingScope"] = 401002] = "MissingScope";
    ApiErrorCodes[ApiErrorCodes["MissingBasicUserClaim"] = 403000] = "MissingBasicUserClaim";
    ApiErrorCodes[ApiErrorCodes["MissingRequiredField"] = 403001] = "MissingRequiredField";
    ApiErrorCodes[ApiErrorCodes["InvalidFieldValue"] = 403002] = "InvalidFieldValue";
    ApiErrorCodes[ApiErrorCodes["MissingLikedByScreenName"] = 403005] = "MissingLikedByScreenName";
    ApiErrorCodes[ApiErrorCodes["NoIntegrationsAvailable"] = 403006] = "NoIntegrationsAvailable";
    ApiErrorCodes[ApiErrorCodes["InvalidAuthorization"] = 403007] = "InvalidAuthorization";
})(ApiErrorCodes || (ApiErrorCodes = {}));
//# sourceMappingURL=Nudge.js.map