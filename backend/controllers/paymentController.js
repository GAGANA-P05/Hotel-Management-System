const db = require("../config/database");

// ======================= RECORD NEW PAYMENT =======================
const makePayment = async (req, res) => {
  try {
    const { Reservation_ID, Amount, Payment_mode } = req.body;

    // Basic validation
    if (!Reservation_ID || !Amount || !Payment_mode) {
      return res.status(400).json({
        success: false,
        error: "Please provide Reservation_ID, Amount, and Payment_mode",
      });
    }

    // Insert payment record
    const [result] = await db.query(
      `INSERT INTO payment (Reservation_ID, Amount, Payment_mode, Date)
       VALUES (?, ?, ?, NOW())`,
      [Reservation_ID, Amount, Payment_mode]
    );

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      Payment_ID: result.insertId,
    });

    // Real-time socket emit (for manager dashboard auto-refresh)
    req.app.get("io").emit("paymentUpdated");
  } catch (error) {
    console.error("Error in makePayment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================= FETCH ALL PAYMENTS (MANAGER) =======================
const getAllPayments = async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT 
        p.Payment_ID,
        p.Reservation_ID,
        p.Date,
        p.Payment_mode,
        p.Amount,
        c.Name AS Customer_Name,
        r.Room_Number
      FROM payment p
      JOIN reservation r ON p.Reservation_ID = r.Reservation_ID
      JOIN customer c ON r.Customer_ID = c.Customer_ID
      ORDER BY p.Payment_ID DESC;
    `);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { makePayment, getAllPayments };
