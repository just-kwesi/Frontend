const router = require('express').Router();
const Note = require('../db/Notes');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);

  note ? res.status(200).json(note) : res.status(404).end();
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndRemove(id);

  res.status(204).end();
});

router.post('/', async (req, res) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();

  res.status(201).json(savedNote);
});

router.put('/:id', async (request, response) => {
  const { content, important } = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  );

  response.json(updatedNote);
});
