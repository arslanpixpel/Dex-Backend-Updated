const router = require("express").Router();
const {
  getExchanges,
  saveUserExchange,
  updateUserExchange,
} = require("../controllers/exchangesController");

router.get("/", getExchanges);
router.post("/setexchange", saveUserExchange);
router.put("/updateexchange", updateUserExchange);

module.exports = router;
