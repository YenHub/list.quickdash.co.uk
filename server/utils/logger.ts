type MessageSource = '[TestAPI]';

const log = (msgSource: MessageSource) => {
    return (msg: string) => {
        const date = new Date().toLocaleTimeString();
        console.log(`\x1b[32m${date} ${msgSource} ${msg}\x1b[0m`);
    };
};

const warn = (msgSource: MessageSource) => {
    return (msg: string) => {
        const date = new Date().toLocaleTimeString();
        console.log(`\x1b[33m${date} ${msgSource} ${msg}\x1b[0m`);
    };
};

const error = (msgSource: MessageSource) => {
    return (msg: string) => {
        const date = new Date().toLocaleTimeString();
        console.log(`\x1b[31m${date} ${msgSource} ${msg}\x1b[0m`);
    };
};

export const apiLog = log('[TestAPI]');
export const apiWarn = warn('[TestAPI]');
export const apiError = error('[TestAPI]');
