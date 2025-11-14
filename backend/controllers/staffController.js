const db = require('../config/database');

// Get all staff
const getAllStaff = async (req, res) => {
  try {
    const [staff] = await db.query('SELECT * FROM Staff');
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get staff by ID
const getStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;
    const [staff] = await db.query('SELECT * FROM Staff WHERE Staff_ID = ?', [staffId]);

    if (staff.length === 0) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    res.status(200).json({ success: true, data: staff[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get staff by task (e.g., Technician, Maintenance, Manager, Security)
const getStaffByTask = async (req, res) => {
  try {
    const { task } = req.params;

    // Fetch all staff with that task
    const [staff] = await db.query('SELECT * FROM Staff WHERE Task = ?', [task]);

    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No staff found with task: ${task}`
      });
    }

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// Add new staff
const addStaff = async (req, res) => {
  try {
    const { Name, Email, Phone, Address, Salary, Task } = req.body;

    if (!Name || !Email || !Phone || !Address || !Salary || !Task) {
        return res.status(400).json({
          success: false,
          error: 'Please provide Name, Email, Phone, Address, Salary, and Task'
  });
}


    // Manager gets salary = 0 automatically
    const finalSalary = Task === 'Manager' ? 0 : (Salary || Math.floor(Math.random() * 25000));

    const [result] = await db.query(
      'INSERT INTO Staff (Name, Email, Phone, Address, Salary, Task) VALUES (?, ?, ?, ?, ?, ?)',
      [Name, Email, Phone, Address, finalSalary, Task]
    );

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      data: { Name, Email, Phone, Address, Salary: finalSalary, Task }
    });

    // Emit real-time update event
    req.app.get('io').emit('staffUpdated');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update staff details
const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { Name, Email, Phone, Address, Salary, Task } = req.body;

    // Check if this staff is a Manager
    const [existing] = await db.query('SELECT * FROM Staff WHERE Staff_ID = ?', [staffId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    if (existing[0].Task === 'Manager') {
      return res.status(403).json({
        success: false,
        error: 'Manager details cannot be updated.'
      });
    }

    const finalSalary = Task === 'Manager' ? 0 : Salary;

    const [result] = await db.query(
      'UPDATE Staff SET Name=?, Email=?, Phone=?, Address=?, Salary=?, Task=? WHERE Staff_ID=?',
      [Name, Email, Phone, Address, finalSalary, Task, staffId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Staff updated successfully'
    });

    // Emit real-time event
    req.app.get('io').emit('staffUpdated');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Prevent deleting Managers too
    const [existing] = await db.query('SELECT * FROM Staff WHERE Staff_ID = ?', [staffId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    if (existing[0].Task === 'Manager') {
      return res.status(403).json({
        success: false,
        error: 'Manager record cannot be deleted.'
      });
    }

    const [result] = await db.query('DELETE FROM Staff WHERE Staff_ID = ?', [staffId]);

    res.status(200).json({
      success: true,
      message: 'Staff deleted successfully'
    });

    req.app.get('io').emit('staffUpdated');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  addStaff,
  updateStaff,
  deleteStaff,
  getStaffByTask
};
