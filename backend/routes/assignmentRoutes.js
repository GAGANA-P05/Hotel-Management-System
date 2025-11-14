const express = require("express");
const router = express.Router();
const controller = require("../controllers/assignmentController");

router.get("/", controller.getAllAssignments);
router.get("/room/:roomNumber", controller.getAssignmentByRoom);
router.get("/staff/:staffId", controller.getAssignmentByStaff);

module.exports = router;
