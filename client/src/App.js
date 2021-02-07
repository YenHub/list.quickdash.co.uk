import './App.css';
import LegacyNotes from './Services/LegacyNotes';
import { useState, useEffect } from 'react';

const RenderLegacyNotes = () => {

    const [ legacyNotes, setLegacyNotes ] = useState(null);

    useEffect( () => {
        setLegacyNotes([...LegacyNotes.get()]);
        // TODO: Enable this to clear old legacy notes
        // LegacyNotes.clear();
    }, [])

    if (legacyNotes?.length > 0) {
        return legacyNotes.map((note, ind) => <li key={`note-${ind}`}>{note}</li>);
    }

    return (
        <div> No Notes </div>
    );
}

const App = () => (
    <div className="App">
        <header className="App-header">
            <ul>
                <RenderLegacyNotes />
            </ul>
        </header>
    </div>
);

export default App;