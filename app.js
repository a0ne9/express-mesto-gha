const express = require("express");
const mongoose = require("mongoose");
const { UserRouter } = require("./routes/users");
const { CardsRouter } = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: "6284c8c1b4e4f0de38637095",
  };

  next();
});

app.use("/", UserRouter);
app.use("/", CardsRouter);
app.use("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена!" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
