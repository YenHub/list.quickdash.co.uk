import NotesList from './NotesList'

const Checklist = () => (
    <div className="App">
        <header className="App-header">
            <NotesList /> <br />
            <br />
            <a href='/legacy'>Back To Legacy Site</a>
        </header>
    </div>
);

export default Checklist;