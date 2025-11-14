const express = require('express');
const router = express.Router();
const {
  bookRoom,
  bookService,
  getAllReservations,
  getReservationsByCustomer,
  getReservationsByRoom
} = require('../controllers/reservationController');

// ======================= RESERVATION ROUTES =======================

// Book a room
router.post('/', bookRoom);                     // POST /api/reservations

// Book a service for a reservation
router.post('/service', bookService);           // POST /api/reservations/service

// Get all reservations
router.get('/', getAllReservations);            // GET /api/reservations

// Get reservations by customer ID
router.get('/customer/:id', getReservationsByCustomer); // GET /api/reservations/customer/:id

// Get reservations by room number
router.get('/room/:roomNumber', getReservationsByRoom); // GET /api/reservations/room/:roomNumber

module.exports = router;
