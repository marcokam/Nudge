export default class AsyncInitializer {
    private readonly initializer: () => Promise<void>;    
    private promise: Promise<void> | null = null;

    constructor(initializer: () => Promise<void>) {
        this.initializer = initializer;
    }
    initialize = () => {
        if (!this.promise) {
            this.promise = this.initializer();
        }
        return this.promise;
    }
}
