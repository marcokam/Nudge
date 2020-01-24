import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "react-spring";

import { Person } from "~/Data/NudgeInterfaces";
import { Cache } from "~/Data/DataInterfaces";

import * as logger from "~/Logging/DefaultLogger";
import { uriToId } from "~/Uris/uriUtils";
import { compose, noop } from "~/Util/fp/function";
import { filter } from "~/Util/fp/array";
import { propOr } from "~/Util/fp/object";
import { getEntity } from "~/Util/apiUtils";
import { NudgeUris } from "~/Uris/NudgeUris";
import { Identity, IdentityType, sortAndFilterIdentities } from "~/Data/Identity/identityData";

import { PersonProfileProps } from "~/Components/Company/OrgChart/OrgChart";
import { TeamInteractions } from "~/Components/Team/TeamInteractions";
import NudgeLink from "~/Components/UI/Link/NudgeLink";
import { socialIcons } from "~/Components/Icons/Social/icons";
import { ExternalLink } from "~/Components/UI/Link/ExternalLink";
import { option, tryCatch } from "~/Util/fp/Instances/Option";
import { EditIcon } from "~/Components/Icons/Icons";
import { flaggedDataReason, FlaggedDataReason } from "~/Data/Person/Metadata/flagData";


const defaultStyles = {
    minWidth: "24rem",
};
interface PersonSummaryProps {
    person: Person;
    PersonProfile: React.FunctionComponent<PersonProfileProps>;
    style?: React.CSSProperties;
    cache?: Cache;
    flaggedUris?: Record<string,string>;
    flagUri?: (uri: string, reason?: FlaggedDataReason) => void;
}
interface Interaction {
    type: string;
    date: string;
    displayDate?: string;
    teammate?: Partial<Person>;
};

const getUniqueIdentities = (identities: Identity[]) =>
    option.of(identities)
        .map(compose(
            sortAndFilterIdentities,
            filter(compose(
                type => type !== "facebook",
                propOr("type", ""),
            )),
        ))
        .getOrElse(() => [] as Identity[]);


export const PersonSummary: React.FunctionComponent<PersonSummaryProps> = ({
    person,
    PersonProfile,
    style = defaultStyles,
    cache,
    flaggedUris = {},
    flagUri = noop,
}) => {
    const { uri, name, title, imageUrl, teamInteractions = {}, identities: initialIdentities } = person;
    const [identities, setIdentities] = useState(getUniqueIdentities(initialIdentities as Identity[]));
    const [edited, setEdited] = useState(false);
    const isEdited = edited || !!flaggedUris[uri];
    const { transform, opacity, revOpacity } = useSpring({
        opacity: isEdited ? 1 : 0,
        revOpacity: isEdited ? 0 : 1,
        transform: `perspective(600px) rotateX(${isEdited ? 180 : 0}deg)`,
        config: config.stiff,
    });

    useEffect(() => {
        if (initialIdentities && initialIdentities.length === 0) {
            return;
        }
        let cancelled = false;
        getEntity(NudgeUris.v2.people(person.uri)._instanceUri, { fields: `uri,identities` }, { cache })
            .fork(
                err => {
                    if (cancelled) return;
                    logger.error("Error getting identities", err);
                },
                ({ identities }: { identities: Identity[] }) => {
                    if (cancelled) return;
                    setIdentities(getUniqueIdentities(identities));
                }
            );

        return () => {
            cancelled = true;
        }

    }, [initialIdentities, person.uri, cache]);

    return (
        <div className="bg-white pa3 ba b--black-10 br2 shadow-4" style={style}>
            <header className="mb2">
                <div className="mt2">
                    <PersonProfile
                        size={50}
                        className="mw6"
                        name={name}
                        title={title}
                        imageUrl={imageUrl}
                    />
                </div>
                {uri.startsWith("/v2/people") &&
                    <div className="flex items-center justify-between h2 mt2">
                        <div className="flex">
                            <NudgeLink
                                className="link nudge-blue mv1 f6 hover-underline"
                                to={`/contactProfilePage?id=${uriToId(uri).getOrElse(() => "")}`}
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                }}
                            >
                                View Profile
                            </NudgeLink>
                            {identities && identities.length > 0 && (
                                <div className="flex items-center ml3">
                                    {identities.map(({ type = IdentityType.none, identity = "", externalUrl = "" }) =>
                                        tryCatch(() => socialIcons[type as IdentityType])
                                            .map(({ icon: Icon, style }) => (
                                                <ExternalLink
                                                    key={identity}
                                                    href={externalUrl}
                                                    className="dtc v-mid pr2 link dark-gray f7 dib"
                                                    title={
                                                        type === "twitter"
                                                            ? `@${identity}`
                                                            : identity
                                                    }
                                                >
                                                    <Icon style={style} />
                                                </ExternalLink>
                                            ))
                                            .getOrElse(() => null))}
                                </div>
                            )}
                        </div>
                        <div className="relative w4-5 h-100 flex items-center justify-end">
                            <animated.div
                                className={`absolute link nudge-blue f7 hover-underline pointer flex ${isEdited ? "" : "z-1"}`}
                                style={{ opacity: revOpacity, transform }}
                                onClick={() => {
                                    setEdited(state => !state);
                                    flagUri(uri);
                                }}
                            >
                                <EditIcon />
                                <span className="ml1">Flag as incorrect</span>
                            </animated.div>
                            <animated.div
                                className="absolute pa1 bg-nudge-highlight-background nudge-highlight-text f7"
                                style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }}
                            >
                                <span>Thanks! We'll review and update this profile shortly.</span>
                                <a className="link di underline pointer bg-animate hover-bg-washed-yellow ph1" onClick={() => {
                                    flagUri(uri, flaggedDataReason.incorrectCompany);
                                }}>Hide profile</a>
                            </animated.div>
                        </div>
                    </div>
                }
            </header>
            <TeamInteractions interactions={teamInteractions} PersonProfile={PersonProfile} person={person}/>
        </div>
    );
};