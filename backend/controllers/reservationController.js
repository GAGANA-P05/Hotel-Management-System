const db = require('../config/database');

// ======================= BOOK ROOM =======================
const bookRoom = async (req, res) => {
  try {
    const { Customer_ID, Room_Number, Check_in_date, Check_out_date } = req.body;

    // Validation
    if (!Customer_ID || !Room_Number || !Check_in_date || !Check_out_date) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Customer_ID, Room_Number, Check_in_date, and Check_out_date'
      });
    }

    // Fetch room details
    const [roomData] = await db.query(
      'SELECT Price FROM room WHERE Room_Number = ?',
      [Room_Number]
    );

    if (roomData.length === 0) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    const roomPrice = roomData[0].Price;

    // Insert reservation
    const [reservation] = await db.query(
      `INSERT INTO reservation (Customer_ID, Room_Number, Check_in_date, Check_out_date)
       VALUES (?, ?, ?, ?)`,
      [Customer_ID, Room_Number, Check_in_date, Check_out_date]
    );

    // Update room status to Reserved
    await db.query('UPDATE room SET Status = "Reserved" WHERE Room_Number = ?', [Room_Number]);

    // Response
    res.status(201).json({
      success: true,
      message: 'Room booked successfully. Proceed to payment.',
      Reservation_ID: reservation.insertId,
      Price: roomPrice
    });

    // Notify frontend
    req.app.get('io').emit('roomUpdated');

  } catch (error) {
    if (error.sqlState === '45000') {
      return res.status(400).json({
        success: false,
        error: error.sqlMessage || 'Trigger validation failed'
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// ======================= BOOK SERVICE =======================
const bookService = async (req, res) => {
  try {
    const { Customer_ID, Service_ID, Payment_mode } = req.body;

    // Validation
    if (!Customer_ID || !Service_ID || !Payment_mode) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Customer_ID, Service_ID, and Payment_mode'
      });
    }

    // Fetch latest reservation for that customer
    const [reservationData] = await db.query(
      `SELECT Reservation_ID 
       FROM reservation 
       WHERE Customer_ID = ? 
       ORDER BY Reservation_ID DESC 
       LIMIT 1`,
      [Customer_ID]
    );

    if (reservationData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Customer must have an active reservation before booking a service.'
      });
    }

    const reservationId = reservationData[0].Reservation_ID;

    // Fetch service details
    const [serviceData] = await db.query(
      'SELECT Price, Availability, Service_Name FROM services WHERE Service_ID = ?',
      [Service_ID]
    );

    if (!serviceData || serviceData.length === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const service = serviceData[0];

    // Check service availability
    if (service.Availability !== 1) {
      return res.status(400).json({
        success: false,
        error: `Service '${service.Service_Name}' is currently unavailable.`
      });
    }

    const servicePrice = service.Price;

    // Insert record into Avails table
    const [availInsert] = await db.query(
      'INSERT INTO avails (Reservation_ID, Service_ID) VALUES (?, ?)',
      [reservationId, Service_ID]
    );

    // Record payment
    await db.query(
      `INSERT INTO payment (Reservation_ID, Date, Payment_mode, Amount)
       VALUES (?, CURDATE(), ?, ?)`,
      [reservationId, Payment_mode, servicePrice]
    );

    res.status(201).json({
      success: true,
      message: `Service booked successfully for Reservation ID ${reservationId}`,
      Avail_ID: availInsert.insertId,
      Reservation_ID: reservationId,
      Service_ID,
      Amount: servicePrice
    });

    req.app.get('io').emit('serviceUpdated');

  } catch (error) {
    console.error('Error booking service:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================= GET ALL RESERVATIONS =======================
const getAllReservations = async (req, res) => {
  try {
    const [reservations] = await db.query(
      'SELECT Reservation_ID, Customer_ID, Room_Number, Check_in_date, Check_out_date, Number_of_days FROM reservation'
    );
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================= GET RESERVATIONS BY CUSTOMER =======================
const getReservationsByCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const [reservations] = await db.query(
      'SELECT Reservation_ID, Customer_ID, Room_Number, Check_in_date, Check_out_date, Number_of_days FROM reservation WHERE Customer_ID = ?',
      [id]
    );

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No reservations found for this customer'
      });
    }

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================= GET RESERVATIONS BY ROOM NUMBER =======================
const getReservationsByRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const [reservations] = await db.query(
      `SELECT Reservation_ID, Customer_ID, Room_Number, Check_in_date, Check_out_date, Number_of_days
       FROM reservation
       WHERE Room_Number = ?`,
      [roomNumber]
    );

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reservations found for this room number."
      });
    }

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error("Error fetching reservations by room:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  bookRoom,
  bookService,
  getAllReservations,
  getReservationsByCustomer,
  getReservationsByRoom
};
