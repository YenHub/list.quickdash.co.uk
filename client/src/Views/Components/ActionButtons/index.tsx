import { FC, useContext, useState } from 'react';

import Button from '@material-ui/core/Button';

import { getUniqueId } from '../../../Services/UUID';
import { downloadFile } from '../../../Services/BrowserUtils';
import { NoteItem } from '../../../Services/Database/NoteStore';
import ActionDialog from '../ActionDialog';

import { store } from '../../../Services/State/Store';

import faker from 'faker';

const DeleteAlert = (handleAccept: () => void, handleClose: () => void) => (
    <ActionDialog
        open={true}
        title="Delete List"
        message="Are you sure you want to delete all of your notes?"
        onAccept={handleAccept}
        onCancel={handleClose}
    />
);

const CustomButton = (props: any) => (
    <Button
        {...props}
        edge="end"
        variant="outlined"
        fullWidth
    >
        {props['aria-label']}
    </Button>
);

export const DeleteNotes: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { noteState } = state;
    const [showDeleteAlert, toggleDeleteAlert] = useState<boolean>(false);

    const clearNotes = (): void => {
        dispatch({ type: 'SetNotes', payload: [] });
        toggleDeleteAlert(false);
    };

    const handleDeleteClick = () => toggleDeleteAlert(true);
    const handleDeleteCancel = () => toggleDeleteAlert(false);

    const buttonProps = {
        'aria-label': 'Delete List',
        onClick: handleDeleteClick,
        disabled: noteState?.length === 0,
        'data-testid': 'delete-all-notes',
        color: 'primary',
    };

    return (
        <div style={{ width: '100%' }}>
            {showDeleteAlert && (
                DeleteAlert(clearNotes, handleDeleteCancel)
            )}
            <CustomButton {...buttonProps} />
        </div>
    );
};

export const ImportButton: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { noteState } = state;

    const importNotes = (noteState: NoteItem[]) => {
        const currentNotes = [...noteState];
        const newNotes = [];

        // Generate a random number within a range
        const random = (n: number) => {
            return Math.min(Math.floor(Math.random() * n));
        };

        const properCase = (str: string): string => {
            return str.replace(/\w\S*/g, (txt: string) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };

        const generatePrimary = (): string | undefined => {
            const testVal = random(100);
            if (testVal < 10) {
                return;
            }
            if (testVal < 60) {
                return getWords();
            }

            return properCase(faker.random.word());
        };

        const getWords = (count?: number): string => {
            return properCase((
                random(100) > 50 ? faker.random.words(count) : faker.lorem.words(count)
            ));
        };
        const getWord = (): string => {
            return properCase((
                random(100) > 40 ? faker.random.word() : faker.lorem.word()
            ));
        };

        const generateSecondary = (): string | undefined => {
            const testVal = random(100);
            if (testVal < 10) {
                return;
            }
            if (testVal < 40) {
                if(random(50) > 25) {
                    return `## ${getWord()}\n\n` +
                    `- ${getWords()}\n\n` +
                    `${random(10) > 5 ? '' : ' '}- ${getWords()}\n\n` +
                    `- ${getWords()}\n\n` +
                    `\n\n---\n\n` +
                    `### ${properCase(faker.random.words(random(5)))}\n\n` +
                    `- ${getWords()}\n\n` +
                    `${random(10) > 5 ? '' : ' '}- ${getWords()}\n\n` +
                    `- ${getWords()}`;
                }

                return `## ${getWord()}\n\n` +
                `- ${getWords()}\n\n` +
                `${random(10) > 5 ? '' : ' '}- ${getWords()}\n\n` +
                `- ${getWords()}`;
            }

            if (testVal < 70) {
                return `## ${getWord()}\n\n` +
                `- ${getWords(random(4))}\n\n` +
                `- ${getWord()}\n\n`;
            }

            if (testVal < 80) {
                return `## ${getWord()}\n\n` +
                `- ${getWords()}\n\n` +
                `${random(10) > 5 ? '' : ' '}- ${getWords()}\n\n` +
                `- ${getWords()}\n\n` +
                `\n\n---\n\n` +
                `### ${getWords(2)}\n\n` +
                `${getWords()}\n\n` +
                `${random(10) > 5 ? '' : ' '}- ${getWords()}\n\n` +
                `- ${getWords()}\n\n\n\n` +
                `${getWord()} | ${getWords(5)}\n` +
                `-- | --\n` +
                `${getWords(2)} | ${getWords(5)}\n` +
                `${getWord()} | ${getWords(2)}\n` +
                `${getWord()} | ${getWord()}\n` +
                `${getWords(4)} | ${getWords(7)}`;
            }

            return getWord();
        };

        for (let i = 0; i < random(15); i++) {
            newNotes.push({
                secondary: generateSecondary(),
                primary: generatePrimary(),
            });
        }
        newNotes.map(item => {
            return currentNotes.push({ ...item, id: getUniqueId(currentNotes) });
        });
        dispatch({ type: 'SetNotes', payload: currentNotes });
    };

    const buttonProps = {
        'aria-label': 'CREATE RANDOM NOTES',
        onClick: () => importNotes(noteState),
        disabled: !noteState,
        type: 'secondary',
    };

    return <CustomButton {...buttonProps} />;

};

export const ExportButton: FC = () => {

    const globalState = useContext(store);
    const { state } = globalState;
    const { noteState } = state;

    const exportNotes = (noteState: NoteItem[]): void => {
        const exportContent = JSON.stringify(noteState.map(note => ({ primary: note.primary, secondary: note.secondary })));
        downloadFile(exportContent);
    };

    const buttonProps = {
        'aria-label': 'EXPORT NOTES',
        onClick: () => exportNotes(noteState),
        disabled: noteState?.length === 0,
        type: 'default',
    };

    return <CustomButton {...buttonProps} />;
};
