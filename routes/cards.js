const router = require("express").Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard} = require("../controllers/cards");

router.delete("/cards/:id", deleteCard);

router.put("/cards/:id/likes", likeCard);

router.delete("/cards/:id/likes", dislikeCard);

router.get("/cards", getCards);

router.post("/cards", createCard);

module.exports.CardsRouter = router;