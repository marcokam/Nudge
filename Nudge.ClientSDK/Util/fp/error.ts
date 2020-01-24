export const throwError = (err: string | Error): never => {
    if (err instanceof Error) {
        throw err;
    }
    throw new Error(err);    
}

export const notImplemented = () => { 
    throw "Not Implemented";
}