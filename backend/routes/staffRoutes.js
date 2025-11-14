const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  addStaff,
  updateStaff,
  getStaffByTask,
  deleteStaff
} = require('../controllers/staffController');

// Routes
router.get('/', getAllStaff);              // GET /api/staff
router.get('/:staffId', getStaffById);     // GET /api/staff/:staffId
router.post('/', addStaff);                // POST /api/staff
router.put('/:staffId', updateStaff);      // PUT /api/staff/:staffId
router.delete('/:staffId', deleteStaff);   // DELETE /api/staff/:staffId
router.get('/task/:task', getStaffByTask);

module.exports = router;
