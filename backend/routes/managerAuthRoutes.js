const express = require("express");
const router = express.Router();
const { managerLogin } = require("../controllers/managerAuthController");

router.post("/login", managerLogin);

module.exports = router;
