import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IMain } from '../../Main';

export default function MDToggle(
    { mdMode, setMDMode }: Pick<IMain, "mdMode" | "setMDMode">
): JSX.Element {

    const toggleChecked = () => setMDMode(state => !state);

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
}

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
                        data-testid="md-toggle"
                        checked={previewMode}
                        onChange={toggleChecked}
                        color="primary"
                    />
                }
            />
        </FormGroup>
    );
}