const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const app = express();

// allow Cross-orign resource saring(CORS)
app.use(cors());

// body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/api', require('./routes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
