import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { IMain } from '../../Main';

export default function DarkModeToggle(
    { darkMode, setDarkMode }: Pick<IMain, "darkMode" | "setDarkMode">
): JSX.Element {

    const toggleChecked = (): void => setDarkMode((state) => !state);

    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch data-testid="dm-toggle" checked={darkMode} onChange={toggleChecked} color="primary" />}
                label="Dark Mode"
            />
        </FormGroup>
    );
}