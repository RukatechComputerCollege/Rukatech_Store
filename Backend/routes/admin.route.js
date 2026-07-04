const express = require('express')
const multer = require('multer');
const { adminLogin, adminDashboard, adminCustomer, deleteCustomer, createProduct, getAllProducts, editProduct, deleteProduct, deleteSelectedProduct, getAllOrdersForAdmin, updateOrderStatus, fetchAllCustomers, getOrdersGroupedByMonth, getCustomersGroupedByMonth, getOrdersGroupedByHour, getOrdersGroupedByHourForDates, getProductById, toggleUserBan, getFlashSales, createFlashSale, toggleProductStock } = require('../controller/admin.controller')
const { authenticate } = require('../auth')
const { authorizeRoles } = require('../authorizesRole')
const authMiddleware = require('../middlewareAuth')

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", adminLogin)
router.get("/dashboard", authenticate, authorizeRoles, adminDashboard)
router.get("/allCustomers", authenticate, authorizeRoles, adminCustomer)
router.get("/customer/all", authenticate, authorizeRoles, fetchAllCustomers)
router.post("/deleteCustomers", authenticate, authorizeRoles, deleteCustomer)
router.post("/createProduct", authenticate, authorizeRoles, upload.array('images', 10), createProduct)
router.get("/getAllProducts", getAllProducts)
router.put("/editproduct/:id", authenticate, authorizeRoles, upload.array('images', 10), editProduct)
router.delete("/deleteproduct/:id", authenticate, authorizeRoles, deleteProduct)
router.delete('/deleteSelectedProduct', authenticate, authorizeRoles, deleteSelectedProduct)
router.get('/orders', authenticate, authorizeRoles, getAllOrdersForAdmin)
router.put('/orders/:id/status', authenticate, authorizeRoles, updateOrderStatus)
router.get('/order/monthly', authenticate, authorizeRoles, getOrdersGroupedByMonth)
router.get('/order/weekly', authenticate, authorizeRoles, require('../controller/admin.controller').getOrdersGroupedByWeek)
router.get('/customers/monthly', authenticate, authorizeRoles, getCustomersGroupedByMonth)
router.get('/orders/hourly/', authenticate, authorizeRoles, getOrdersGroupedByHourForDates)
router.get('/flashsales', authenticate, authorizeRoles, getFlashSales)
router.post('/flashsales', authenticate, authorizeRoles, createFlashSale)

// Generic product route
router.get('/product/:id', getProductById)
router.put('/product/:id/stock', authenticate, authorizeRoles, toggleProductStock)
router.put('/user/:id/ban', authenticate, authorizeRoles, toggleUserBan)

module.exports = router




