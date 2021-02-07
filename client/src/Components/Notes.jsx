import LegacyNotes from '../Services/LegacyNotes';
import { useState, useEffect } from 'react';
import NotesList from './NotesList'

const RenderLegacyNotes = () => {

    const [legacyNotes, setLegacyNotes] = useState(null);

    useEffect(() => {
        setLegacyNotes([...LegacyNotes.get()]);
        // TODO: Enable this to clear old legacy notes
        // LegacyNotes.clear();
    }, [])

    if (legacyNotes?.length > 0) {
        return legacyNotes.map((note, ind) => <span key={`note-${ind}`}>{note}</span>);
    }

    return (
        <div> No Notes </div>
    );
};

const Checklist = () => (
    <div className="App">
        <header className="App-header">
            {/* <RenderLegacyNotes /> */}
            <NotesList /> <br />
            <br />
            <a href='/legacy'>Back To Legacy Site</a>
        </header>
    </div>
);

export default Checklist;