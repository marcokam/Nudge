import { WebsiteIcon } from "./WebsiteIcon";
import { EmailIcon } from "./EmailIcon";
import { TwitterIcon } from "./TwitterIcon";
import { LinkedInIcon } from "./LinkedInIcon";
import { TeamsIcon } from "./TeamsIcon";
export declare const socialIcons: {
    teams: {
        icon: typeof TeamsIcon;
        style: {
            width: number;
        };
    };
    email: {
        icon: typeof EmailIcon;
        style: {
            width: number;
        };
    };
    domain: {
        icon: typeof WebsiteIcon;
        style: {
            width: number;
        };
    };
    twitter: {
        icon: typeof TwitterIcon;
        style: {
            width: number;
        };
    };
    linkedin: {
        icon: typeof LinkedInIcon;
        style: {
            width: number;
        };
    };
    facebook: {
        icon: () => null;
        style: null;
    };
    none: {
        icon: () => null;
        style: null;
    };
};
