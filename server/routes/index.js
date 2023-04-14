const router = require('express').Router();

router.use('/notes', require('./notes'));

router.use((req, res, next) => {
  const err = new Error('Page Not Found!');
  next(err);
});

module.exports = router;