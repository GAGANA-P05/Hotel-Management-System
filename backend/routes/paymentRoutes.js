const express = require("express");
const router = express.Router();
const { makePayment, getAllPayments } = require("../controllers/paymentController");

router.post("/", makePayment);
router.get("/", getAllPayments);

module.exports = router;
