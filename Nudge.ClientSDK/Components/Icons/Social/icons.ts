import { WebsiteIcon } from "./WebsiteIcon";
import { EmailIcon } from "./EmailIcon";
import { TwitterIcon } from "./TwitterIcon";
import { LinkedInIcon } from "./LinkedInIcon";
import { TeamsIcon } from "./TeamsIcon";
import { IdentityType } from "~/Data/Identity/identityData";

export const socialIcons = {
    [IdentityType.teams]: {
        icon: TeamsIcon,
        style: { width: 14 },
    },
    [IdentityType.email]: {
        icon: EmailIcon,
        style: { width: 13 },
    },
    [IdentityType.domain]: {
        icon: WebsiteIcon,
        style: { width: 14 },
    },
    [IdentityType.twitter]: {
        icon: TwitterIcon,
        style: { width: 14 },
    },
    [IdentityType.linkedin]: {
        icon: LinkedInIcon,
        style: { width: 14 },
    },
    [IdentityType.facebook]: {
        icon: () => null,
        style: null,
    },
    [IdentityType.none]: {
        icon: () => null,
        style: null,
    }
};
