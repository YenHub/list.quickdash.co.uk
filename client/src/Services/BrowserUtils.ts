const isIE = () => navigator.userAgent.indexOf('MISE ') !== -1 || !!navigator.userAgent.match(/Trident.*rv:11\./);

export const downloadFile = (content: string): void => {
    const _fileName = `QuickList-${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    if (isIE() && window.navigator.msSaveOrOpenBlob) {
        // for IE versions 10+
        const blobObject = new Blob([content]);
        // Download using MS msSaveOrOpenBlob
        window.navigator.msSaveOrOpenBlob(blobObject, _fileName);
    } else {
        // All other browsers
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', _fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
