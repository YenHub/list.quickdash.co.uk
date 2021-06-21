import { Fragment, FC, useContext } from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { store, ToggleTypes } from '../../../Services/State/Store';

const MDPreviewToggle: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { previewMode } = state;

    const toggleChecked = () => {
        dispatch({ type: ToggleTypes.PreviewModeToggle });
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

interface ToggleProps {
    state: boolean;
    dispatchType: ToggleTypes;
    label: string;
    qaId: string;
}

export const MenuToggle: FC<ToggleProps> = ({ state, dispatchType, label, qaId }) => {

    const globalState = useContext(store);
    const { dispatch } = globalState;

    const toggleChecked = (): void => dispatch({ type: dispatchType });

    return (
        <Fragment>
            <FormGroup>
                <FormControlLabel
                    control={(
                        <Switch data-testid={qaId} checked={state} onChange={toggleChecked} color="primary" />
                    )}
                    label={label}
                />
            </FormGroup>
        </Fragment>
    );
};

export default MenuToggle;
