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
    updateRoomPrice,
    checkRoomAvailability  
} = require('../controllers/roomController');

// ================== FIX: Availability Check Route FIRST ==================
router.get('/check/:roomNumber', checkRoomAvailability);  
// GET /api/rooms/check/101

// ================== EXISTING ROUTES ==================
router.get('/', getAllRooms);                     
router.get('/available', getAvailableRooms);
router.get('/maintenance', getMaintenanceRooms);
router.get('/reserved', getReservedRooms);
router.get('/deluxe', getDeluxeRooms);
router.get('/standard', getStandardRooms);
router.get('/:roomNumber', getRoomByNumber);      

router.put('/:roomNumber', updateRoomStatus);
router.put('/:roomNumber/price', updateRoomPrice);

module.exports = router;
