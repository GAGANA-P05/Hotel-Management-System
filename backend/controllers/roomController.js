const db = require('../config/database');

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const [rooms] = await db.query('SELECT * FROM Room');
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get available rooms only
const getAvailableRooms = async (req, res) => {
    try {
        const [rooms] = await db.query(
            "SELECT * FROM Room WHERE Status = 'Vacant'"
        );
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get reserved rooms only
const getReservedRooms = async (req, res) => {
    try {
        const [rooms] = await db.query(
            "SELECT * FROM Room WHERE Status = 'Reserved'"
        );
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Maintenance rooms only
const getMaintenanceRooms = async (req, res) => {
    try {
        const [rooms] = await db.query(
            "SELECT * FROM Room WHERE Status = 'Maintenance'"
        );
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Deluxe rooms only
const getDeluxeRooms = async (req, res) => {
    try {
        const [rooms] = await db.query(
            "SELECT * FROM Room WHERE Type = 'Deluxe'"
        );
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Standard rooms only
const getStandardRooms = async (req, res) => {
    try {
        const [rooms] = await db.query(
            "SELECT * FROM Room WHERE Type = 'Standard'"
        );
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getRoomByNumber = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    // Call stored procedure
    const [resultSets] = await db.query('CALL GetRoomByNumber(?)', [roomNumber]);

    res.status(200).json({
      success: true,
      data: resultSets[0]   // directly return whatever procedure sends
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// Update room status (Staff function)
const updateRoomStatus = async (req, res) => {
    try {
        const { roomNumber } = req.params;
        const { Status } = req.body;
        
        if (!Status) {
            return res.status(400).json({
                success: false,
                error: 'Please provide Status'
            });
        }
        
        const [result] = await db.query(
            'UPDATE Room SET Status = ? WHERE Room_Number = ?',
            [Status, roomNumber]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Room status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update room price (Staff function)
const updateRoomPrice = async (req, res) => {
    try {
        const { roomNumber } = req.params;
        const { Price } = req.body;

        if (!Price) {
            return res.status(400).json({
                success: false,
                error: 'Please provide Price'
            });
        }

        if (isNaN(Price) || Price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Price value'
            });
        }

        const [result] = await db.query(
            'UPDATE Room SET Price = ? WHERE Room_Number = ?',
            [Price, roomNumber]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Room price updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ================= CHECK ROOM AVAILABILITY =================
const checkRoomAvailability = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    if (!roomNumber) {
      return res.status(400).json({ success: false, error: "Room number required" });
    }

    // Call the SQL function
    const [result] = await db.query("SELECT CheckRoomAvailability(?) AS available", [roomNumber]);
    const isAvailable = result[0].available;

    if (isAvailable) {
      res.status(200).json({
        success: true,
        message: `Room ${roomNumber} is available for booking.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Room ${roomNumber} is not available or does not exist.`,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



module.exports = {
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
};