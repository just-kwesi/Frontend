import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    console.log('effect');
    axios.get('http://localhost:3001/notes').then((res) => {
      console.log('promise fullfilled');
      setNotes(res.data);
    });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObj = {
      content: newNote,
      id: notes.length + 1,
      important: Math.random() < 0.5,
    };
    setNotes([...notes, noteObj]);
  };
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
