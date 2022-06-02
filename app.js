const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors, celebrate, Joi } = require('celebrate');
const { UserRouter } = require('./routes/users');
const { CardsRouter } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { isAuthorised } = require('./middlewares/isAuthorised');
const NotFoundError = require('./errors/NotFoundError');

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

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /(http|www|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:~+#-]*[\w@?^=%&~+#-])/,
      ),
    }),
  }),
  createUser,
);

app.use(isAuthorised);
app.use('/', UserRouter);
app.use('/', CardsRouter);

app.use('*', () => {
  throw new NotFoundError('Страница не найдена!');
});

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
app.listen(PORT);
