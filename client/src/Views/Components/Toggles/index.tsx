import React, { useContext } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IMain } from '../../Main';

import { store } from '../../../Services/State/Store';

export const MDPreviewToggle = (
    { previewMode, setPreviewMode }: Pick<IMain, "previewMode" | "setPreviewMode">
): JSX.Element => {

    const toggleChecked = () => setPreviewMode(state => !state);

    return (
        <FormGroup>
            <FormControlLabel
                label="Always Show Preview"
                control={
                    <Switch
                        data-testid="md-preview-toggle"
                        checked={previewMode}
                        onChange={toggleChecked}
                        color="primary"
                    />
                }
            />
        </FormGroup>
    );
};

export const MDToggle: React.FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { mdMode } = state;

    const toggleChecked = () => {
        dispatch({ type: 'MarkDownToggle' });
    };

    return (
        <FormGroup>
            <FormControlLabel
                label="Enable MarkDown"
                control={
                    <Switch
                        data-testid="md-toggle"
                        checked={mdMode}
                        onChange={toggleChecked}
                        color="primary"
                    />
                }
            />
        </FormGroup>
    );
};

export const DarkModeToggle: React.FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { darkMode } = state;

    const toggleChecked = (): void => {
        dispatch({ type: 'DarkModeToggle' });
    };

    return (
        <React.Fragment>
            <FormGroup>
                <FormControlLabel
                    control={<Switch data-testid="dm-toggle" checked={darkMode} onChange={toggleChecked} color="primary" />}
                    label="Dark Mode"
                />
            </FormGroup>
        </React.Fragment>
    );
};