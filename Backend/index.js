const express = require('express');
const app = express();
const serverless = require('serverless-http');
const userRouter = require('./routes/user.route');
const adminRouter = require('./routes/admin.route');
const orderRouter = require('./routes/trackOrder.route');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { adminRegister, fetchPaginatedCustomers } = require('./controller/admin.controller');
const PORT = process.env.PORT
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { ipKeyGenerator } = require("express-rate-limit");
const adminModel = require('./model/admin.model');

// Middleware
app.use(helmet())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: ipKeyGenerator
});

app.use(limiter);
app.use(cors({
  origin: ['http://localhost:5173', 'https://rukatechstore.vercel.app', 'https://www.rukatechstore.com', 'https://rukatechstore.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// healthCheck
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Dynamically import the keepalive-server package
(async () => {
    // Checks if the script is not running in a serverless environment
    if (process.env.NODE_ENV !== 'production' || process.env.IS_SERVERLESS) return;
    try {
        const { ping } = await import('keepalive-server');
        // Ping your app's health endpoint every 14 minutes (840,000 milliseconds)
        ping(14 * 60 * 1000, 'https://rukatech-store.onrender.com/health');
        console.log('✅ Keep-alive pinger started.');
    } catch (err) {
        console.error('Failed to start keepalive-server:', err.message);
    }
})();

// Routes
app.use("/user", userRouter);
app.use(`/${process.env.ADMIN_ROUTE_NAME}`, adminRouter);
app.use("/orders", orderRouter);

// Connect DB once
mongoose.connect(process.env.URI)
  .then(async () => {
    console.log("Database Connected");
    app.listen(PORT, ()=>{
      console.log('app running on Port', PORT);
    })
    const existingAdmin = await adminModel.findOne({ username: process.env.admin_username });
    if (!existingAdmin) {
      await adminRegister();
    }
    await fetchPaginatedCustomers();
  })
  .catch((err) => {
    console.log("DB connection error", err);
  });

// 👉 Export handler for Vercel
// module.exports = app;
// module.exports.handler = serverless(app);
