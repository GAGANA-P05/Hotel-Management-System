const db = require("../config/database");

// ======================= GET ALL ASSIGNMENTS =======================
exports.getAllAssignments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        sa.Assignment_ID,
        sa.Room_Number,
        s.Staff_ID,
        s.Name,
        s.Task
      FROM staff_assignment sa
      JOIN staff s ON sa.Staff_ID = s.Staff_ID
      ORDER BY sa.Room_Number
    `);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error in getAllAssignments:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ======================= GET BY ROOM NUMBER =======================
exports.getAssignmentByRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const [rows] = await db.query(

      //===INNER JOIN to fetch staff details along with assignments===//
      `
      SELECT 
        sa.Assignment_ID,
        sa.Room_Number,
        s.Staff_ID,
        s.Name,
        s.Task
      FROM staff_assignment sa
      JOIN staff s ON sa.Staff_ID = s.Staff_ID
      WHERE sa.Room_Number = ?
    `,
      [roomNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No assignment found for this room",
      });
    }

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error in getAssignmentByRoom:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ======================= GET BY STAFF ID =======================
exports.getAssignmentByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        sa.Assignment_ID,
        sa.Room_Number,
        s.Staff_ID,
        s.Name,
        s.Task
      FROM staff_assignment sa
      JOIN staff s ON sa.Staff_ID = s.Staff_ID
      WHERE sa.Staff_ID = ?
    `,
      [staffId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No assignments found for this staff member",
      });
    }

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error in getAssignmentByStaff:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

