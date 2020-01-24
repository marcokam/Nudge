import { IUser } from "../NudgeInterfaces";

export interface WeeklyActivityResult {
    dtaPnt?: {
        InboundEmail: number;
        InboundTwitter: number;
        Meetings: number;
        OutboundEmail: number;
        OutboundTwitter: number;
        RelationshipGrowth: number;
        StartDate: number;
        TimeOrder: string;
        TimeTick: string;
    }[];
};
export interface WeeklyActivity {
    calculationDate: string;
    result: {
        communications?: WeeklyActivityResult;
    };
    summary: {
        emailsSent: number;
        meetingsBooked: number;
        relationshipsBuilt: number;
    };
};

interface LeaderboardResult {
    [rank: number]: IUser;
};
export interface Leaderboard {
    calculationDate: string;
    count: number;
    results: LeaderboardResult[];
};

export interface NetworkViewPerson {
    aggId: number;
    aggDspNam: string;
    jobTtl: string;
    imgThmUrl: string;
    cty: string;
    cnt: string;
    manCmpAggId: number;
    manCmpNam: string;
}
export interface NetworkViewCompany {
    cmpAggId: number;
    cmpDspNam: string;
    lgoLrg: string;
}
export interface NetworkView {
    calculationDate: string;
    result: {
        companies: NetworkViewCompany[];
        people: NetworkViewPerson[];
        totalCompanies: number;
        totalContacts: number;
    };
    summary: {
        newCompanies: number;
        newContacts: number;
    };
}

interface ContactIdentity {
    externalUrl: string;
    identity: string;
    type: string;
    isNew: boolean;
}
export interface ContactActivity {
    uri: string;
    name: string;
    imageUrl: string;
    title: string;
    company?: {
        uri: string;
        name: string;
        imageUrl: string;
    };
    city: string;
    state: string;
    country: string;
    strength: number;
    maxStrength: number;
    inboundEmail: number;
    lastInboundEmailDate: string;
    outboundEmail: number;
    lastOutboundEmailDate: string;
    meetings: number;
    lastMeetingDate: string;
    identities: ContactIdentity[];
}

export interface StrengthChangeResult {
    dtaPnt?: {
        relStrDif: number;
        relStrDis: string;
        relStrStrDif: number;
        relStrTtlDif: number;
        strDte: number;
        tmeInc: string;
        tmeOrd: string;
        tmeTic: string;
    }[];
};
export interface RelationshipsView {
    calculationDate: string;
    result: {
        active: NetworkViewPerson[];
        activeCount: number;
        strong: NetworkViewPerson[];
        strongCount: number;
        strengthChange?: StrengthChangeResult; 
    };
    summary: {
        activeRelationships: number;
        strongRelationships: number;
    };
}