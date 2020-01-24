import React, { FunctionComponent } from "react";
import { RelationshipStrength } from "../../Data/Person/Relationship/relationshipData";
interface IconContainerProps {
    className: string;
    style: React.CSSProperties;
}
export declare const IconContainer: FunctionComponent<IconContainerProps>;
export declare function HomeIcon({ fill, containerStyles, containerClassName }: {
    fill?: string | undefined;
    containerStyles?: {} | undefined;
    containerClassName?: string | undefined;
}): JSX.Element;
export declare function NewsIcon({ fill, containerStyles, containerClassName }: {
    fill?: string | undefined;
    containerStyles?: {} | undefined;
    containerClassName?: string | undefined;
}): JSX.Element;
export declare function SearchIcon({ fill, containerStyles, containerClassName }: {
    fill?: string | undefined;
    containerStyles?: {} | undefined;
    containerClassName?: string | undefined;
}): JSX.Element;
export declare function CalendarIcon({ fill, containerStyles, containerClassName }: {
    fill?: string | undefined;
    containerStyles?: {} | undefined;
    containerClassName?: string | undefined;
}): JSX.Element;
export declare function AlertIcon({ fill, containerStyles, containerClassName }: {
    fill?: string | undefined;
    containerStyles?: {} | undefined;
    containerClassName?: string | undefined;
}): JSX.Element;
export declare function RightChevronIcon({ fill, containerStyles, containerClassName }: {
    fill?: string | undefined;
    containerStyles?: {} | undefined;
    containerClassName?: string | undefined;
}): JSX.Element;
export declare function EditIcon({ fill, containerStyles, containerClassName }: {
    fill?: string | undefined;
    containerStyles?: {} | undefined;
    containerClassName?: string | undefined;
}): JSX.Element;
interface WiFiIconProps {
    type: "collab" | "";
    level: RelationshipStrength;
    containerStyles?: React.CSSProperties;
    containerClassName?: string;
}
export declare const WiFiIcon: React.FunctionComponent<WiFiIconProps>;
export {};
