const express = require('express');
const router = express.Router();
const {
    getAllRooms,
    getAvailableRooms,
    getReservedRooms,
    getMaintenanceRooms,
    getStandardRooms,
    getDeluxeRooms,
    getRoomByNumber,
    updateRoomStatus,
    updateRoomPrice
 
} = require('../controllers/roomController');

// Routes
router.get('/', getAllRooms);                    // GET /api/rooms
router.get('/available', getAvailableRooms);     // GET /api/rooms/available
router.get('/Maintenance', getMaintenanceRooms);     // GET /api/rooms/Maintenance
router.get('/Reserved', getReservedRooms);     // GET /api/rooms/Reserved
router.get('/Deluxe', getDeluxeRooms);     // GET /api/rooms/Deluxe
router.get('/Standard', getStandardRooms);     // GET /api/rooms/Standard
router.get('/:roomNumber', getRoomByNumber);     // GET /api/rooms/101
router.put('/:roomNumber', updateRoomStatus);    // PUT /api/rooms/101
router.put('/:roomNumber/price', updateRoomPrice);


module.exports = router;