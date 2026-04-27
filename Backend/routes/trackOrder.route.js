const express = require('express')
const { trackOrder } = require('../controller/trackOrder')
const router = express.Router()


router.get('/track/:id', trackOrder)

module.exports = router