const router = require('express').Router();
const Note = require('../db/Notes');

module.exports = router;

router.get('/', async (req, res, next) => {
  const notes = await Note.find();
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
