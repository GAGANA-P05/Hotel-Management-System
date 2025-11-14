const db = require('../config/database');

// ======================= GET ALL SERVICES =======================
const getAllServices = async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM services');
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= GET AVAILABLE SERVICES =======================
const getAvailableServices = async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT * FROM services WHERE Availability = 1'
    );
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= GET UNAVAILABLE SERVICES =======================
const getUnavailableServices = async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT * FROM services WHERE Availability = 0'
    );
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= GET SERVICE BY ID =======================
const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const [service] = await db.query(
      'SELECT * FROM services WHERE Service_ID = ?',
      [serviceId]
    );

    if (service.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // ✅ Return array to match frontend expectation (data.data[0])
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= ADD NEW SERVICE (MANAGER) =======================
const addService = async (req, res) => {
  try {
    const { Service_Name, Description, Price, Availability } = req.body;

    // Validate all required fields
    if (
      !Service_Name ||
      !Description ||
      Price === undefined ||
      Availability === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Service_Name, Description, Price, and Availability'
      });
    }

    // Validate Price
    if (isNaN(Price) || Price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Price value'
      });
    }

    // Validate Availability (must be 0 or 1)
    if (![0, 1, '0', '1'].includes(Availability)) {
      return res.status(400).json({
        success: false,
        error: 'Availability must be 0 (Unavailable) or 1 (Available)'
      });
    }

    // Insert into DB
    await db.query(
      'INSERT INTO services (Service_Name, Description, Price, Availability) VALUES (?, ?, ?, ?)',
      [Service_Name.trim(), Description.trim(), Price, Availability]
    );

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      data: { Service_Name, Description, Price, Availability }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= UPDATE SERVICE AVAILABILITY =======================
const updateServiceAvailability = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { Availability } = req.body;

    if (Availability === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Availability (0 or 1)'
      });
    }

    const [result] = await db.query(
      'UPDATE services SET Availability = ? WHERE Service_ID = ?',
      [Availability, serviceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Service availability updated successfully to ${Availability}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= UPDATE SERVICE (MANAGER) =======================
const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { Service_Name, Description, Price, Availability } = req.body;

    // Validate required fields
    if (
      !Service_Name ||
      !Description ||
      Price === undefined ||
      Availability === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Service_Name, Description, Price, and Availability'
      });
    }

    if (isNaN(Price) || Price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Price value'
      });
    }

    if (![0, 1, '0', '1'].includes(Availability)) {
      return res.status(400).json({
        success: false,
        error: 'Availability must be 0 (Unavailable) or 1 (Available)'
      });
    }

    const [result] = await db.query(
      `UPDATE services 
       SET Service_Name = ?, Description = ?, Price = ?, Availability = ?
       WHERE Service_ID = ?`,
      [Service_Name.trim(), Description.trim(), Price, Availability, serviceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: { Service_ID: serviceId, Service_Name, Description, Price, Availability }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ======================= DELETE SERVICE =======================
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const [result] = await db.query(
      'DELETE FROM services WHERE Service_ID = ?',
      [serviceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllServices,
  getAvailableServices,
  getUnavailableServices,
  getServiceById,
  addService,
  updateServiceAvailability,
  updateService,
  deleteService
};
