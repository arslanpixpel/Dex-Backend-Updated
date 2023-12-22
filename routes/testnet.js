const express = require("express");

const router = express.Router();
const formController = require("../controllers/testnetController");

router.post("/submit", formController.submitForm);

module.exports = router;
