export type Setting = 'mdMode' | 'darkMode' | 'previewMode' | 'shareList';

export const showGatedFeatures = process.env.NODE_ENV === 'development' || process.env.REACT_APP_BETA === 'true';

export const getBoolSetting = (setting: Setting): boolean => {
    if (window.localStorage.getItem(setting)) {
        return window.localStorage.getItem(setting) === 'true';
    }

    if (showGatedFeatures && setting === 'mdMode') {
        return true;
    }

    return !['mdMode', 'shareList'].some( blacklist => setting === blacklist);
};

export const setBoolSetting = (setting: Setting, value: boolean): void => localStorage.setItem(setting, value.toString());

export const bigLog = (msg: string): void => {

    if (!showGatedFeatures) {
        return;
    }

    console.log(`

            ${msg}

        `);
};

export const groupLog = (name: string, msg: any): void => {

    if (!showGatedFeatures) {
        return;
    }

    console.groupCollapsed(name);
    console.log(msg);
    console.groupEnd();
};

export const shallowCompareIdentical = (objA: any, objB: any): boolean => !Object.keys(objA).some( key => objA[key] !== objB[key]);
