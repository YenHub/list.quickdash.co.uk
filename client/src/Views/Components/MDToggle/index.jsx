import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function MDToggle({ mdMode, setMDMode }) {

    const toggleChecked = () => {
        setMDMode((state) => !state);
    };

    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch checked={mdMode} onChange={toggleChecked} color="primary"/>}
                label="Enable Markdown (beta)"
            />
        </FormGroup>
    );
}