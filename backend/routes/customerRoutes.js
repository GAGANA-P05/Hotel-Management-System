const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  addCustomer,
} = require('../controllers/customerController');

// Routes
router.get('/', getAllCustomers);        // GET /api/customers
router.get('/:id', getCustomerById);     // GET /api/customers/:id
router.post('/', addCustomer);           // POST /api/customers


module.exports = router;
