const { Router } = require("express");
const wallet = require("../controllers/wallet");
router = Router();

router.post("/createWallet", wallet.createWallet);
router.post("/recoverWallet", wallet.recoverWallet);
router.post("/createAccount", wallet.createAccount);
router.post("/balance", wallet.getBalance);
router.post("/transfer", wallet.transfer);
router.post("/transaction", wallet.getTransaction);
router.post("/tokenName", wallet.getTokenName);
router.post("/tokenSymbol", wallet.getTokenSymbol);
router.post("/tokenSupply", wallet.getTokenSupply);
router.post("/tokenBalance", wallet.getTokenBalance);
router.post("/transferTokens", wallet.transferTokens);

module.exports = router;
