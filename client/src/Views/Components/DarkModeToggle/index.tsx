import React, { useContext } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { setBoolSetting } from '../../../Services/ReactUtils';

import { store } from '../../../Services/State/Store';

const DarkModeToggle: React.FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { darkMode } = state;

    const toggleChecked = (): void => {
        setBoolSetting('darkMode', !darkMode);
        dispatch({ type: 'DarkModeToggle' })
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

export default DarkModeToggle;