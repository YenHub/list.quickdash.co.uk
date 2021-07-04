// Generate a random number within a range
import faker from 'faker';
import { NoteItem } from '../../../Services/Database/NoteClient';

export const random = (n: number) => Math.min(Math.floor(Math.random() * n));
export const properCase = (str: string): string => {
    return str.replace(/\w\S*/g, (txt: string) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

const getWords = (count?: number): string => properCase((
    random(100) > 50 ? faker.random.words(count) : faker.lorem.words(count)
));

const getWord = (): string => properCase((
    random(100) > 40 ? faker.random.word() : faker.lorem.word()
));

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

/* tslint:disable */
const generateSecondary = (): string | undefined => {

    const testVal = random(100);

    if (testVal < 10) {
        return testVal < 4 ? `> ${getWords(random(15))}` : '';
    }

    if (testVal < 40) {
        if (random(50) > 25) {
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
/* tslint:enable */

export const generateNotes = (): Partial<NoteItem> => {

    return {
        primary: generatePrimary(),
        secondary: generateSecondary(),
    };
};

export default generateNotes;
