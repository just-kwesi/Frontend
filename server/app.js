const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

//DB Connection

const url = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);
mongoose.set('strictQuery', false);
mongoose
  .connect(url)
  .then(() => console.log(`db connection successful`))
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const app = express();

// allow Cross-orign resource saring(CORS)
app.use(cors());

// body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/api', require('./routes'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
