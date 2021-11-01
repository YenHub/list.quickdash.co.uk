import { NoteItem } from '../Services/Database/NoteClient';
export type Setting = 'mdMode' | 'darkMode' | 'previewMode';

export const showGatedFeatures = process.env.NODE_ENV === 'development' || process.env.REACT_APP_BETA === 'true';

export const getBoolSetting = (setting: Setting): boolean => {
    if (window.localStorage.getItem(setting)) {
        return window.localStorage.getItem(setting) === 'true';
    }

    if (showGatedFeatures && setting === 'mdMode') {
        return true;
    }

    return setting !== 'mdMode';
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

export const groupLog = (name: string, msg: string): void => {

    if (!showGatedFeatures) {
        return;
    }

    console.groupCollapsed(name);
    console.log(msg);
    console.groupEnd();
};

export const shallowCompareIdentical = (
    objA: NoteItem,
    objB: NoteItem,
): boolean => !Object.keys(objA || {}).some(key => objA[key as keyof NoteItem] !== objB[key as keyof NoteItem]);
