const router = require("express").Router();
const { transferBack } = require("../controllers/nftCronController");

router.get("/transfer", transferBack);
// router.get("/swap/lp-tokens", getLpTokenMetadata);

module.exports = router;
