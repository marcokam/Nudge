var _a;
import { WebsiteIcon } from "./WebsiteIcon";
import { EmailIcon } from "./EmailIcon";
import { TwitterIcon } from "./TwitterIcon";
import { LinkedInIcon } from "./LinkedInIcon";
import { TeamsIcon } from "./TeamsIcon";
import { IdentityType } from "../../../Data/Identity/identityData";
export var socialIcons = (_a = {},
    _a[IdentityType.teams] = {
        icon: TeamsIcon,
        style: { width: 14 },
    },
    _a[IdentityType.email] = {
        icon: EmailIcon,
        style: { width: 13 },
    },
    _a[IdentityType.domain] = {
        icon: WebsiteIcon,
        style: { width: 14 },
    },
    _a[IdentityType.twitter] = {
        icon: TwitterIcon,
        style: { width: 14 },
    },
    _a[IdentityType.linkedin] = {
        icon: LinkedInIcon,
        style: { width: 14 },
    },
    _a[IdentityType.facebook] = {
        icon: function () { return null; },
        style: null,
    },
    _a[IdentityType.none] = {
        icon: function () { return null; },
        style: null,
    },
    _a);
//# sourceMappingURL=icons.js.map