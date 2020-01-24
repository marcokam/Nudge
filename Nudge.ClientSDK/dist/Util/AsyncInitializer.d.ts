export default class AsyncInitializer {
    private readonly initializer;
    private promise;
    constructor(initializer: () => Promise<void>);
    initialize: () => Promise<void>;
}
