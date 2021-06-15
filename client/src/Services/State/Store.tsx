import React, { createContext, useReducer } from 'react';
import { getBoolSetting } from '../ReactUtils';

export type State = {
    darkMode: boolean,
};

export type Actions = { type: 'DarkModeToggle' } | { type: 'SetNotes', payload: string[] };

const initialState: State = {
    darkMode: getBoolSetting('darkMode'),
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
            case 'SetNotes':
                // return { ...state, NoteStore: [...action.payload] };
                return { ...state };
            default:
                return { ...state };
        };
    };

    const [state, dispatch] = useReducer(stateReducer, initialState);

    const stateValue = { state, dispatch };

    return <Provider value={stateValue}>{children}</Provider>;
};

export { store, StateProvider };