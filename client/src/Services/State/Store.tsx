import React, { createContext, useReducer } from 'react';

type State = {
    'DarkMode': boolean,
    'NoteStore': string[] | null,
};

type Actions = { type: 'DarkModeToggle', payload: boolean } | { type: 'SetNotes', payload: string[] };

const initialState: State = {
    DarkMode: true,
    NoteStore: null,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider: React.FC = ({ children }: any) => {

    const stateReducer = (state: State, action: Actions): State => {
        switch (action.type) {
            case 'DarkModeToggle':
                return { ...state, DarkMode: action.payload };
            case 'SetNotes':
                return { ...state, NoteStore: [...action.payload] };
            default:
                return { ...state };
        };
    };

    const [state, dispatch] = useReducer(stateReducer, initialState);

    const stateValue = { ...state, dispatch };

    return <Provider value={stateValue}>{children}</Provider>;
};

export { store, StateProvider };