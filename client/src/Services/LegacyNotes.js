// DevFuncs
window.setNotes = () => window.localStorage.listConfig = '{"0":"Revisit API Models","1":"Implement client side JWT","2":"Add user settings modal"}';
window.removeNotes = () => window.localStorage.removeItem('listConfig');

// export const clearLegacyNotes = () =>

export default class LegacyNotes {
    // TODO: Probably want to call this after the UI renders successfully to prevent racing...
    static clear = () => window.localStorage.removeItem('listConfig');
    static get = () => Array.from(Object.values(JSON.parse( window.localStorage.listConfig || '{}' )));
};