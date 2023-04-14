const router = require('express').Router();

module.exports = router;

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: false,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
  {
    content: 'a new note',
    important: false,
    id: 4,
  },
  {
    content: 'good to be back',
    important: true,
    id: 5,
  },
];

router.get('/', (req, res, next) => {
  res.status(200).json(notes);
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  note ? res.status(200).json(note) : res.status(400).end();
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

router.post('/', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  res.json(note);
});
