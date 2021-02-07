const log = (msgSource) => {
    return (msg) => {
        let date = new Date().toLocaleTimeString();
        console.log(`${date} ${msgSource} ${msg}`);
    };
};

exports.apiLog = log('[TestAPI]');