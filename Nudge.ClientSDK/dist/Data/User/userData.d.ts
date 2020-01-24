import { KeyMap, Query } from "../DataInterfaces";
import { License, CurrentUserSettings } from "./UserInterfaces";
export declare const currentUserSettingsKeys: KeyMap<CurrentUserSettings>;
export declare const getCurrentUserSettings: (query: Query) => import("../../Util/fp/Instances/Task").Task<unknown, any>;
export declare const updateCurrentUserSettings: (settings: CurrentUserSettings) => import("../../Util/fp/Instances/Task").Task<unknown, any>;
export declare const getCurrentUser: () => import("../../Util/fp/Instances/Option").Option<import("./UserInterfaces").CurrentUser>;
export declare const getLicenses: (f: (l: License) => boolean) => import("../../Util/fp/Instances/Option").Some<License[]> | import("../../Util/fp/Instances/Option").None<License[]>;
export declare const getValidLicenses: () => import("../../Util/fp/Instances/Option").Some<License[]> | import("../../Util/fp/Instances/Option").None<License[]>;
export declare const hasValidLicenses: () => import("../../Util/fp/Instances/Option").Option<boolean>;
