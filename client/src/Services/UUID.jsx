import { v4 as uuid } from 'uuid';

export const getUniqueId = noteState => {

    let id = uuid();

    if(!noteState) {
        return id;
    };

    const hasDupes = () => noteState.some(note => note.id === id);
    let sanityCounter = 5;
    while (sanityCounter && hasDupes()) {
        id = uuid();
        sanityCounter--;
        if(sanityCounter === 1) alert('We did a boo boo... 😢');
    };
    return id;
};