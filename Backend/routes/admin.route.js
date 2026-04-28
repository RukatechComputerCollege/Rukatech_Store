const express = require('express')
const { adminLogin, adminDashboard, adminCustomer, deleteCustomer, createProduct, getAllProducts, editProduct, deleteProduct, deleteSelectedProduct, getAllOrdersForAdmin, updateOrderStatus, fetchAllCustomers, getOrdersGroupedByMonth, getCustomersGroupedByMonth, getOrdersGroupedByHour, getOrdersGroupedByHourForDates } = require('../controller/admin.controller')
const { authenticate } = require('../auth')
const { authorizeRoles } = require('../authorizesRole')
const authMiddleware = require('../middlewareAuth')
const { rateProduct, getAverageRating } = require('../controller/rating.controller')
const router = express.Router()

router.post("/login", adminLogin)
router.get("/dashboard", authenticate, authorizeRoles, adminDashboard)
router.get("/allCustomers", authenticate, authorizeRoles, adminCustomer)
router.get("/customer/all", authenticate, authorizeRoles, fetchAllCustomers)
router.post("/deleteCustomers", authenticate, authorizeRoles, deleteCustomer)
router.post("/createProduct", authenticate, authorizeRoles, createProduct)
router.get("/getAllProducts", getAllProducts)
router.put("/editproduct/:id", authenticate, authorizeRoles, editProduct)
router.delete("/deleteproduct/:id", authenticate, authorizeRoles, deleteProduct)
router.delete('/deleteSelectedProduct', authenticate, authorizeRoles, deleteSelectedProduct)
router.get('/orders', authenticate, authorizeRoles, getAllOrdersForAdmin)
router.put('/orders/:id/status', authenticate, authorizeRoles, updateOrderStatus)
router.get('/order/monthly', authenticate, authorizeRoles, getOrdersGroupedByMonth)
router.get('/order/weekly', authenticate, authorizeRoles, require('../controller/admin.controller').getOrdersGroupedByWeek)
router.get('/customers/monthly', authenticate, authorizeRoles, getCustomersGroupedByMonth)
router.get('/orders/hourly/', authenticate, authorizeRoles, getOrdersGroupedByHourForDates)
router.put('/product/:productId', authMiddleware, rateProduct)
router.get('/:id/average-rating', getAverageRating)


module.exports = router




