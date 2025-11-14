const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();

// ======================= MIDDLEWARE =======================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ======================= SOCKET.IO SETUP =======================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Store io globally for controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ======================= IMPORT ROUTES =======================
const managerAuthRoutes = require('./routes/managerAuthRoutes');
const roomRoutes = require('./routes/roomRoutes');
const customerRoutes = require('./routes/customerRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const serviceRoutes = require('./routes/servicesRoutes');
const staffRoutes = require('./routes/staffRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const availsRoutes = require('./routes/availsRoutes'); 
const assignmentRoutes = require("./routes/assignmentRoutes");



// ======================= USE ROUTES =======================
app.use('/api/manager', managerAuthRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/avails', availsRoutes); 
app.use("/api/assignments", assignmentRoutes);

// ======================= FRONTEND STATIC SERVE =======================

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// Fallback route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// ======================= GLOBAL ERROR HANDLER =======================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// ======================= START SERVER =======================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
