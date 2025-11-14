const express = require("express");
const router = express.Router();
const {
  getAllAvails,
  getAvailsByCustomer,
  deleteAvail
} = require("../controllers/availsController");

// ======================= ROUTES =======================
router.get("/", getAllAvails); // Get all booked services
router.get("/customer/:customerId", getAvailsByCustomer); // Get booked services by customer
router.delete("/:availId", deleteAvail); // Delete a booked service (manager use only)

module.exports = router;
