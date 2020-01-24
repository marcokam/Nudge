export declare const NudgeUris: {
    api: {
        aggregateAnalysis: {
            RunWeeklyActivity(userUri?: string | undefined): {
                _uri: string;
                _instanceUri: string;
                _byUri: (instanceUri: string) => string;
                _byId: (instanceId: number) => string;
            };
            RunUserLeaderboard(userUri?: string | undefined): {
                _uri: string;
                _instanceUri: string;
                _byUri: (instanceUri: string) => string;
                _byId: (instanceId: number) => string;
            };
            RunNetworkView(userUri?: string | undefined): {
                _uri: string;
                _instanceUri: string;
                _byUri: (instanceUri: string) => string;
                _byId: (instanceId: number) => string;
            };
            RunRelationshipView(userUri?: string | undefined): {
                _uri: string;
                _instanceUri: string;
                _byUri: (instanceUri: string) => string;
                _byId: (instanceId: number) => string;
            };
        };
        v1: {
            Tokens: {
                external: string;
            };
        };
    };
    v1: {
        Features: {
            Available: string;
        };
    };
    v2: {
        userFlaggedDatas(): {
            _uri: string;
            _instanceUri: string;
            _byUri: (instanceUri: string) => string;
            _byId: (instanceId: number) => string;
        } & {
            currentUser: string;
        };
        people(personUri?: string | undefined): {
            _uri: string;
            _instanceUri: string;
            _byUri: (instanceUri: string) => string;
            _byId: (instanceId: number) => string;
        } & {
            count: string;
            exports: string;
            tweets: string;
            mentions: string;
            lastCommunications: string;
            notes: string;
            experience: string;
            lists(listUri?: string | undefined): {
                _uri: string;
                _instanceUri: string;
                _byUri: (instanceUri: string) => string;
                _byId: (instanceId: number) => string;
            } & {
                networks: {
                    collaborators: string;
                    members: string;
                };
            };
        };
        companies(companyUri?: string | undefined): {
            _uri: string;
            _instanceUri: string;
            _byUri: (instanceUri: string) => string;
            _byId: (instanceId: number) => string;
        } & {
            count: string;
            networks: {
                collaborators: string;
                members: string;
            };
            lists(listUri?: string | undefined): {
                _uri: string;
                _instanceUri: string;
                _byUri: (instanceUri: string) => string;
                _byId: (instanceId: number) => string;
            } & {
                networks: {
                    collaborators: string;
                    members: string;
                };
            };
        };
        users(userUri?: string | undefined): {
            _uri: string;
            _instanceUri: string;
            _byUri: (instanceUri: string) => string;
            _byId: (instanceId: number) => string;
        } & {
            current(): {
                _uri: string;
                _instanceUri: string;
                _byUri: (instanceUri: string) => string;
                _byId: (instanceId: number) => string;
            } & {
                settings: string;
                access: string;
                activities(week?: number): string;
            };
            integrationDetails: string;
        };
        teams(teamUri?: string | undefined): {
            _uri: string;
            _instanceUri: string;
            _byUri: (instanceUri: string) => string;
            _byId: (instanceId: number) => string;
        };
        CompanyAccounts(companyAccountUri?: string | undefined): {
            _uri: string;
            _instanceUri: string;
            _byUri: (instanceUri: string) => string;
            _byId: (instanceId: number) => string;
        } & {
            myadmin: string;
        };
    };
};
