const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const cors = require('cors');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const bodyParser = require('body-parser');

const { errors } = require('celebrate');

const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const auth = require('./middleware/auth');
const { createUser, login } = require('./controllers/users');
const { validateUserBody, validateAuthentication } = require('./middleware/validation');
const { requestLogger, errorLogger } = require('./middleware/logger');

const { NOT_FOUND_STATUS, NOT_FOUND_ERR_MESSAGE } = require('./utils/config');

require('dotenv').config();

app.use(requestLogger);

app.use(limiter);

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/aroundb');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);

app.use(errors());

app.use('*', (req, res) => {
  res.status(NOT_FOUND_STATUS).send(NOT_FOUND_ERR_MESSAGE);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);//eslint-disable-line
});
