const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { UserRouter } = require('./routes/users');
const { CardsRouter } = require('./routes/cards');

const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(helmet());
app.use(limiter);

app.use((req, res, next) => {
  req.user = {
    _id: '6284c8c1b4e4f0de38637095',
  };

  next();
});

app.use('/', UserRouter);
app.use('/', CardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена!' });
});

app.listen(PORT);
