import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import loginService from './services/login';
import Notification from './components/Notification';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // console.log('effect');
    noteService.getAll().then((initialNotes) => {
      // console.log('promise fullfilled');
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObj = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObj).then((note) => {
      setNotes([...notes, note]);
    });
  };
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((n) => (n.id !== id ? n : returnedNote)));
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  //login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  };

  // do not render anything if notes is still null
  if (!notes) {
    return null;
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          {noteForm()}
        </div>
      )}

      <h2>Notes</h2>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => (
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      {/* <Footer /> */}
    </div>
  );
};

export default App;
