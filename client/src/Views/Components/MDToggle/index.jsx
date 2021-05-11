import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function MDToggle({ mdMode, setMDMode }) {

    const toggleChecked = () => setMDMode( state => !state);

    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch data-testid="md-toggle" checked={mdMode} onChange={toggleChecked} color="primary"/>}
                label="Enable MarkDown"
            />
        </FormGroup>
    );
}

export const MDPreviewToggle = ({previewMode, setPreviewMode}) => {

    const toggleChecked = () => setPreviewMode( state => !state);

    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch data-testid="md-toggle" checked={previewMode} onChange={toggleChecked} color="primary"/>}
                label="Always Show Preview"
            />
        </FormGroup>
    );
}