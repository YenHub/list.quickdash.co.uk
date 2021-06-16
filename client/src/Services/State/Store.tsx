import React, { createContext, useReducer } from 'react';
import { getBoolSetting } from '../ReactUtils';

export type State = {
    darkMode: boolean,
    mdMode: boolean,
};

export type Actions = {type: 'MarkDownToggle'} | { type: 'DarkModeToggle' } | { type: 'SetNotes', payload: string[] };

const initialState: State = {
    darkMode: getBoolSetting('darkMode'),
    mdMode: getBoolSetting('mdMode'),
};

const store = createContext<{
    state: State,
    dispatch: React.Dispatch<Actions>
}>({ state: initialState, dispatch: () => undefined });

const { Provider } = store;

const StateProvider: React.FC = ({ children }: any) => {

    const stateReducer = (state: State, action: Actions): State => {
        switch (action.type) {
            case 'DarkModeToggle':
                return { ...state, darkMode: !state.darkMode };
            case 'MarkDownToggle':
                return { ...state, mdMode: !state.mdMode };
            default:
                return { ...state };
        };
    };

    const [state, dispatch] = useReducer(stateReducer, initialState);

    const stateValue = { state, dispatch };

    return <Provider value={stateValue}>{children}</Provider>;
};

export { store, StateProvider };