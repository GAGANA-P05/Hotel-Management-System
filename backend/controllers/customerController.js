const db = require('../config/database');

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.query('SELECT * FROM customer');
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [customer] = await db.query('SELECT * FROM customer WHERE Customer_ID = ?', [id]);

    if (customer.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add new customer
const addCustomer = async (req, res) => {
  try {
    const { Name, Email, Phone, Address, Age } = req.body;

    // Required fields check
    if (!Name || !Email || !Phone) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Name, Email, and Phone'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(Phone)) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be exactly 10 digits'
      });
    }

    // Age validation (optional, handled by trigger for guardian rule)
    if (Age !== undefined && (isNaN(Age) || Age <= 0 || Age > 120)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid age value'
      });
    }

    // Insert into database
    const [result] = await db.query(
      'INSERT INTO customer (Name, Email, Phone, Address, Age) VALUES (?, ?, ?, ?, ?)',
      [Name.trim(), Email.trim(), Phone.trim(), Address?.trim() || null, Age || null]
    );

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      customer_id: result.insertId
    });

  } catch (error) {
    // Handle SQL-level and trigger errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry: A customer with this email or phone already exists'
      });
    }

    if (error.sqlState === '45000') {
      return res.status(400).json({
        success: false,
        error: error.sqlMessage || 'Trigger validation failed'
      });
    }

    console.error('Error adding customer:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer
};
