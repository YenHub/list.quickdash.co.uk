import { Fragment, FC, useContext } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { store } from '../../../Services/State/Store';

export const MDPreviewToggle: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { previewMode } = state;

    const toggleChecked = () => {
        dispatch({ type: 'PreviewModeToggle' });
    };

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

export const MDToggle: FC = () => {

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

export const DarkModeToggle: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { darkMode } = state;

    const toggleChecked = (): void => {
        dispatch({ type: 'DarkModeToggle' });
    };

    return (
        <Fragment>
            <FormGroup>
                <FormControlLabel
                    control={<Switch data-testid="dm-toggle" checked={darkMode} onChange={toggleChecked} color="primary" />}
                    label="Dark Mode"
                />
            </FormGroup>
        </Fragment>
    );
};
