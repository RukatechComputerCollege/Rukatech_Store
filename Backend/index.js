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

// Middleware
app.use(helmet())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: ipKeyGenerator
});
app.use(limiter);
app.use(cors({
  origin: ['http://localhost:5173', 'https://fastcartonlinestore.vercel.app'],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use(`/${process.env.ADMIN_ROUTE_NAME}`, adminRouter);
app.use("/orders", orderRouter);

// Connect DB once
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("Database Connected");
    // app.listen(PORT, ()=>{
    //   console.log('app running on Port', PORT);
    // })
    const { adminModel } = require('./model/admin.model');
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
module.exports = app;
module.exports.handler = serverless(app);
