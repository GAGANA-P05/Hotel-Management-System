const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getAvailableServices,
  getUnavailableServices,
  getServiceById,
  addService,
  updateServiceAvailability,
  deleteService,
  updateService
} = require('../controllers/servicesController');

// Routes
router.get('/', getAllServices);
router.get('/available', getAvailableServices);
router.get('/unavailable', getUnavailableServices);
router.get('/:serviceId', getServiceById);
router.post('/', addService);
router.delete('/:serviceId', deleteService);
router.put('/:serviceId/availability', updateServiceAvailability);
router.put('/:serviceId', updateService);



module.exports = router;
