import { compose } from "../../Util/fp/function";
import { numCompareByDir } from "../../Util/sortUtils";
import { propOr } from "../../Util/fp/object";
import NudgeIterable from "../../Util/NudgeIterable";
import { Compare } from "../../Util/fp/Instances/Compare";
export var IdentityType;
(function (IdentityType) {
    IdentityType["teams"] = "teams";
    IdentityType["email"] = "email";
    IdentityType["domain"] = "domain";
    IdentityType["linkedin"] = "linkedin";
    IdentityType["twitter"] = "twitter";
    IdentityType["facebook"] = "facebook";
    IdentityType["none"] = "none";
})(IdentityType || (IdentityType = {}));
export var IdentityOrdering;
(function (IdentityOrdering) {
    IdentityOrdering[IdentityOrdering["teams"] = 1] = "teams";
    IdentityOrdering[IdentityOrdering["email"] = 2] = "email";
    IdentityOrdering[IdentityOrdering["domain"] = 3] = "domain";
    IdentityOrdering[IdentityOrdering["linkedin"] = 4] = "linkedin";
    IdentityOrdering[IdentityOrdering["twitter"] = 5] = "twitter";
    IdentityOrdering[IdentityOrdering["facebook"] = 6] = "facebook";
    IdentityOrdering[IdentityOrdering["none"] = 7] = "none";
})(IdentityOrdering || (IdentityOrdering = {}));
export var sortAndFilterIdentities = function (identities) {
    return NudgeIterable.fromArray(identities)
        .uniqBy(compose(function (t) { return t.toLowerCase(); }, propOr("type", "")))
        .toArray()
        .sort(Compare.of(numCompareByDir(true))
        .contramap(compose(function (t) { return IdentityOrdering[t] || Infinity; }, propOr("type", "")))
        .run);
};
//# sourceMappingURL=identityData.js.map