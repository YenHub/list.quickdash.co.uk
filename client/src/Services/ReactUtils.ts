export type Setting = 'mdMode' | 'darkMode' | 'previewMode';

export const getBoolSetting = (setting: Setting): boolean => {
    if (window.localStorage.getItem(setting)) {
        return window.localStorage.getItem(setting) === 'true';
    }

    if (process.env.REACT_APP_BETA === 'true' && setting === 'mdMode') {
        return true;
    }

    return setting !== 'mdMode';
};

export const setBoolSetting = (setting: Setting, value: boolean): void => localStorage.setItem(setting, value.toString());
