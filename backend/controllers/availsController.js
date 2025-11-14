const db = require("../config/database");

// ======================= GET ALL AVAILS (Booked Services) =======================
const getAllAvails = async (req, res) => {
  try {
    const [avails] = await db.query(`
      SELECT 
        a.Avail_ID,
        a.Reservation_ID,
        a.Service_ID,
        s.Service_Name,
        s.Price AS Service_Price,
        c.Name AS Customer_Name,
        r.Room_Number,
        r.Check_in_date,
        r.Check_out_date
      FROM avails a
      JOIN reservation r ON a.Reservation_ID = r.Reservation_ID
      JOIN customer c ON r.Customer_ID = c.Customer_ID
      JOIN services s ON a.Service_ID = s.Service_ID
      ORDER BY a.Avail_ID DESC;
    `);

    res.status(200).json({
      success: true,
      count: avails.length,
      data: avails
    });
  } catch (error) {
    console.error("Error fetching avails:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= GET AVAILS BY CUSTOMER ID =======================
const getAvailsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const [avails] = await db.query(`
      SELECT 
        a.Avail_ID,
        a.Reservation_ID,
        a.Service_ID,
        s.Service_Name,
        s.Price AS Service_Price,
        c.Name AS Customer_Name,
        r.Room_Number,
        r.Check_in_date,
        r.Check_out_date
      FROM avails a
      JOIN reservation r ON a.Reservation_ID = r.Reservation_ID
      JOIN customer c ON r.Customer_ID = c.Customer_ID
      JOIN services s ON a.Service_ID = s.Service_ID
      WHERE c.Customer_ID = ?
      ORDER BY a.Avail_ID DESC;
    `, [customerId]);

    if (avails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No avails found for this customer."
      });
    }

    res.status(200).json({
      success: true,
      count: avails.length,
      data: avails
    });
  } catch (error) {
    console.error("Error fetching avails by customer:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= DELETE AVAIL (Manager Option) =======================
const deleteAvail = async (req, res) => {
  try {
    const { availId } = req.params;

    const [result] = await db.query(
      "DELETE FROM avails WHERE Avail_ID = ?",
      [availId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Avail record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Avail record with ID ${availId} deleted successfully`
    });

    // Emit live update
    req.app.get("io").emit("availsUpdated");
  } catch (error) {
    console.error("Error deleting avail:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { getAllAvails, getAvailsByCustomer, deleteAvail };
