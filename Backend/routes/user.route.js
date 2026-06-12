const express = require('express')
const { greetingUser, userLogin, userDashboard, editUser, billingDetails, shippingDetails, changePassword, orderDetails, forgotPassword, resetPassword, getUserOrders } = require('../controller/user.controller')
const { getPublicFlashSales } = require('../controller/admin.controller')
const { rateProduct, getAverageRating, getProductReviews, getUserReviews } = require('../controller/rating.controller')
const whatsAppOrderRouter = require('../controller/whatsAppOrder')
const { authenticate } = require('../auth')
const authMiddleware = require('../middlewareAuth')
const router = express.Router()

router.post("/register", greetingUser)
router.post('/login', userLogin)
router.get('/dashboard', authenticate, userDashboard)
router.put('/update/:id', editUser)
router.put('/updateBilling/:id', billingDetails)
router.put('/updateShipping/:id', shippingDetails)
router.put('/changepassword/:id', changePassword)
router.post('/orderDetails/:id', orderDetails)
router.get('/orders/:id', authenticate, getUserOrders)
router.get('/flashsales', getPublicFlashSales)
router.post('/account/forgot-password', forgotPassword)
router.post('/account/reset-password/:token', resetPassword)

// Rating and review routes for authenticated users
router.put('/product/:productId/rate', authMiddleware, rateProduct)
router.get('/product/:productId/reviews', getProductReviews)
router.get('/reviews/all', authMiddleware, getUserReviews)
router.get('/product/:productId/average-rating', getAverageRating)

router.use('/order', whatsAppOrderRouter)

module.exports = router