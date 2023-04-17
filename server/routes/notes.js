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

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const note = await Note.findById(id);

    note ? res.status(200).json(note) : res.status(400).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await Note.findByIdAndRemove(id);

  res.status(204).end();
});

router.post('/', async (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  await note.save();

  res.json(note);
});

router.put('/:id', (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});
