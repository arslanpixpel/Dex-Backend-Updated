const router = require("express").Router();
const {
  getTokens,
  postToken,
  limit,
  getLimitOrders,
  compeleteLimitOrders,
  hello,
  getLimitOrdersbywallet,
} = require("../controllers/tokensController");
const {
  // buyToken,
  // transection,
  transactionController,
  handleswap,
  swaptransaction,
  handleTransactiontoken,
  createConcordiumClientfunc,
  transectiontokens,
} = require("../controllers/transectionController");

router.get("/list", getTokens);
router.post("/add", postToken);
router.post("/limit", limit);
router.get("/getlimitorders", getLimitOrders);
router.get("/getlimitordersbywallet", getLimitOrdersbywallet);
router.post("/compeletelimitorders", compeleteLimitOrders);
router.get("/transection", transactionController);
router.post("/swap", handleswap);
router.post("/tokenswap", transectiontokens);
router.get("/createConcordiumClient", createConcordiumClientfunc);
router.get("/hello", hello);
module.exports = router;
