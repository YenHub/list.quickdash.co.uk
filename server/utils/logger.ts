type MessageSource = '[TestAPI]';
const log = (msgSource: MessageSource) => {
    return (msg: string) => {
        let date = new Date().toLocaleTimeString();
        console.log(`${date} ${msgSource} ${msg}`);
    };
};

export const apiLog = log('[TestAPI]');