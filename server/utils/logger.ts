export enum MessageSources {
    TestAPI = '[TestAPI]',
    DBClient = '[DBClient]',
}

export const Log = (msgSource: MessageSources) => {
    return (msg: string) => {
        const date = new Date().toLocaleTimeString();
        console.log(`\x1b[32m${date} ${msgSource} ${msg}\x1b[0m`);
    };
};

export const Warn = (msgSource: MessageSources) => {
    return (msg: string) => {
        const date = new Date().toLocaleTimeString();
        console.log(`\x1b[33m${date} ${msgSource} ${msg}\x1b[0m`);
    };
};

export const Err = (msgSource: MessageSources) => {
    return (msg: string) => {
        const date = new Date().toLocaleTimeString();
        console.log(`\x1b[31m${date} ${msgSource} ${msg}\x1b[0m`);
    };
};

export const apiLog = Log(MessageSources.TestAPI);
export const apiWarn = Warn(MessageSources.TestAPI);
export const apiError = Err(MessageSources.TestAPI);
